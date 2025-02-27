const puppeteer = require("puppeteer");
const fs = require("fs");

const urls = {
  segment: "https://segment.com/docs/",
  mparticle: "https://docs.mparticle.com/",
  lytics: "https://docs.lytics.com/",
  zeotap: "https://docs.zeotap.com/home/en-us/",
};

// Function to scrape a single page
async function scrapePage(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded" });

  return await page.evaluate(() => {
    let content = [];
    document.querySelectorAll("h1, h2, h3, p, li").forEach((el) => {
      content.push(el.innerText.trim());
    });
    return content;
  });
}

// Function to extract links from the main doc page
async function getDocLinks(page, baseUrl) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  return await page.evaluate((baseUrl) => {
    let links = [];
    document.querySelectorAll("a").forEach((a) => {
      let href = a.href;
      if (href.startsWith(baseUrl) && !links.includes(href)) {
        links.push(href);
      }
    });
    return links;
  }, baseUrl);
}

// Main function to scrape all CDP documentation
async function scrapeAll() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let scrapedData = [];

  for (const [site, url] of Object.entries(urls)) {
    console.log(`Scraping ${site}...`);
    let siteData = { site, content: [] };

    try {
      let links = await getDocLinks(page, url);
      console.log(`Found ${links.length} links for ${site}`);

      for (let link of links.slice(0, 10)) { // Limiting to 10 pages per site for now
        console.log(`Scraping: ${link}`);
        let content = await scrapePage(page, link);
        siteData.content.push({ url: link, text: content });
      }
    } catch (err) {
      console.error(`Error scraping ${site}:`, err);
    }

    scrapedData.push(siteData);
  }

  await browser.close();

  fs.writeFileSync("docs.json", JSON.stringify(scrapedData, null, 2));
  console.log("✅ Scraping complete! Data saved to docs.json");
}

// Run the scraper
scrapeAll();

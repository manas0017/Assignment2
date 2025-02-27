const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeDocs(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let content = "";

    $("p").each((_, el) => {
      content += $(el).text() + "\n";
    });

    return content;
  } catch (err) {
    console.error("Error scraping:", err);
    return "";
  }
}

module.exports = { scrapeDocs };

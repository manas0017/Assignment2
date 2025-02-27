const fs = require("fs");
const lunr = require("lunr");

// Load scraped documentation
const rawData = fs.readFileSync("docs.json");
const docs = JSON.parse(rawData);

// Create a Lunr search index
const idx = lunr(function () {
  this.ref("id");
  this.field("text");

  let idCounter = 0;
  docs.forEach((doc) => {
    doc.content.forEach((entry) => {
      if (entry.text && entry.text.length > 20) { // Ignore empty or useless text
        this.add({
          id: idCounter,
          site: doc.site,
          text: entry.text.join(" "), // Combine all text
          url: entry.url,
        });
        entry.id = idCounter;
        idCounter++;
      }
    });
  });
});

// Search function
function searchDocs(query) {
  let results = idx.search(query);
  
  if (results.length === 0) {
    console.log("❌ No results found for:", query);
    return { answer: "Sorry, I couldn't find an answer to that." };
  }

  // Get the top match
  let bestMatchId = parseInt(results[0].ref);
  let bestMatch = docs.flatMap(d => d.content).find(entry => entry.id === bestMatchId);

  if (!bestMatch || !bestMatch.text) {
    console.log("❌ Error: bestMatch is undefined or missing text for ID:", bestMatchId);
    return { answer: "Sorry, I found something, but I can't display it properly." };
  }

  // Extract only useful content
  let usefulText = bestMatch.text
    .filter(line => line.length > 50 && !line.includes("Home") && !line.includes("Index")) // Remove garbage
    .join(" ") // Combine into a single response
    .slice(0, 400); // Limit response

  return {
    answer: usefulText + "...",
    link: bestMatch.url,
  };
}

// Test example
console.log(searchDocs("How to set up a new source in Segment?"));

module.exports = { searchDocs };

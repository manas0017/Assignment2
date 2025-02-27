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
      if (entry.text && entry.text.length > 20) { // Ignore short/empty texts
        this.add({
          id: idCounter,
          site: doc.site,
          text: entry.text.join(" "), // Merge text
          url: entry.url,
        });
        entry.id = idCounter;
        idCounter++;
      }
    });
  });
});

// Search function with improved ranking & merging
function searchDocs(query) {
  let results = idx.search(query);
  
  if (results.length === 0) {
    console.log("❌ No results found for:", query);
    return { answer: "Sorry, I couldn't find an answer to that." };
  }

  // Get top 3 matches and merge content
  let selectedMatches = results.slice(0, 3).map(result => {
    let matchId = parseInt(result.ref);
    return docs.flatMap(d => d.content).find(entry => entry.id === matchId);
  }).filter(match => match && match.text);

  if (selectedMatches.length === 0) {
    console.log("❌ Error: No valid matches found");
    return { answer: "Sorry, I found something, but I can't display it properly." };
  }

  // Extract useful content from multiple results
  let combinedAnswer = selectedMatches
    .map(match => match.text
      .filter(line => line.length > 50 && !line.includes("Home") && !line.includes("Index")) // Clean text
      .join(" ") // Merge text
    )
    .join(" "); // Combine multiple answers

  return {
    answer: combinedAnswer.slice(0, 600) + "...", // Show 600 characters
    link: selectedMatches[0].url, // Use first result’s link
  };
}

// Test example
console.log(searchDocs("How to set up a new source in Segment?"));

module.exports = { searchDocs };

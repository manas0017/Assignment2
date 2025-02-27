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
      if (entry.text && entry.text.length > 20) { // Ignore empty/useless text
        this.add({
          id: idCounter,
          site: doc.site,
          text: entry.text.join(" "), 
          url: entry.url,
        });
        entry.id = idCounter;
        idCounter++;
      }
    });
  });
});

// List of CDP-related keywords
const CDP_PLATFORMS = [
    "Segment", "Lytics", "Zeotap", "mParticle", "Adobe Experience Platform",
    "Tealium", "BlueConic", "Treasure Data", "Simon Data", "Amperity"
  ];
  
  function isCDPRelated(query) {
    return CDP_PLATFORMS.some(platform => query.toLowerCase().includes(platform.toLowerCase()));
  }

function searchDocs(query) {
  if (!isCDPRelated(query)) {
    return { answer: "This chatbot is focused on Customer Data Platforms. Try asking about CDPs!" };
  }

  let results = idx.search(query);

  if (results.length === 0) {
    return { answer: "Sorry, I couldn't find an answer to that." };
  }

  let bestMatch = results
    .map(result => ({ 
      ref: parseInt(result.ref), 
      score: result.score 
    }))
    .filter(match => match.score > 0.2) // Ignore low-score matches
    .sort((a, b) => b.score - a.score)[0]; // Get best result

  if (!bestMatch) {
    return { answer: "Sorry, I couldn't find an answer to that." };
  }

  let matchedEntry = docs.flatMap(d => d.content).find(entry => entry.id === bestMatch.ref);

  if (!matchedEntry || !matchedEntry.text) {
    return { answer: "Sorry, I found something, but I can't display it properly." };
  }

  let usefulText = matchedEntry.text
    .filter(line => line.length > 50 && !line.includes("Home") && !line.includes("Index")) 
    .join(" ") 
    .slice(0, 400);

  return {
    answer: usefulText + "...",
    link: matchedEntry.url,
  };
}

module.exports = { searchDocs };

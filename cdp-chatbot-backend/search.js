const lunr = require("lunr");

let documents = [
  { id: 1, title: "Segment", content: "How to set up a new source in Segment" },
  { id: 2, title: "mParticle", content: "How to create user profile in mParticle" },
];

const idx = lunr(function () {
  this.ref("id");
  this.field("title");
  this.field("content");

  documents.forEach((doc) => this.add(doc));
});

function searchDocs(query) {
  const results = idx.search(query);
  if (results.length === 0) {
    return "Sorry, I couldn't find any relevant information.";
  }

  const doc = documents.find((d) => d.id === parseInt(results[0].ref));
  return doc ? doc.content : "No relevant information found.";
}

module.exports = { searchDocs };

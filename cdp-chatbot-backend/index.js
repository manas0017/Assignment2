const express = require("express");
const cors = require("cors");
const { scrapeDocs } = require("./scraper");
const { searchDocs } = require("./search");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatbot Backend is Running!");
});

// API to handle user questions
app.post("/ask", async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ message: "Please provide a question." });
  }
  
  const answer = searchDocs(question);
  res.json({ answer });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

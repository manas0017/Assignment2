const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { searchDocs } = require("./search");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/search", (req, res) => {
  const query = req.body.query;
  if (!query) {
    return res.status(400).json({ error: "Query is required!" });
  }

  const result = searchDocs(query);
  res.json({ answer: result });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

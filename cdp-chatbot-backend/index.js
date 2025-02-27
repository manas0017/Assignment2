const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { searchDocs } = require("./search");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/search", (req, res) => {
    const question = req.body.question;
    if (!question) {
        return res.status(400).json({ error: "question is required!" });
    }

    const result = searchDocs(question);
    res.json(result); // Send the object directly, no extra "answer" wrapper
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

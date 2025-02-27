import { useState } from "react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);
    setError(null);
    
    try {
      const res = await axios.post("http://localhost:5000/search", { question });
      setResponse(res.data);
    } catch (err) {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>CDP Chatbot</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a 'how-to' question..."
        style={{ padding: "10px", width: "60%", fontSize: "16px" }}
      />
      <button onClick={handleAsk} style={{ padding: "10px 15px", marginLeft: "10px" }}>Ask</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Answer:</strong> {response.answer}</p>
          <a href={response.link} target="_blank" rel="noopener noreferrer">Read More</a>
        </div>
      )}
    </div>
  );
}

export default App;

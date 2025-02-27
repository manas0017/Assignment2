import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!question.trim()) return;

    const newMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, newMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("https://assignment2-sd2w.onrender.com/search", { question });
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: res.data.answer, link: res.data.link },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="zbot">
        <div className="circle">
        <img src="zbot.png" alt="Description" />
        </div>

        <span className="center">Zbot</span>
        </div>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
            {msg.link && (
              <a href={msg.link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            )}
          </div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
        <div ref={chatRef}></div>
      </div>
      <div className="input-box">
        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask something..."
        />
        <button className="sendbutton" onClick={handleSend}>
          <img src="Vector.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export default ChatBot;

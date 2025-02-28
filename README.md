CDP Chatbot - Complete Documentation
Overview
The CDP Chatbot is a web-based application designed to provide users with answers to queries related to Customer Data Platforms (CDP). It consists of a frontend (React) and a backend (Node.js with Express & Lunr.js) that powers the search functionality. The chatbot processes user queries, searches a pre-scraped dataset of CDP-related documentation, and returns the most relevant response.
Features
AI-powered Search: Uses Lunr.js to provide fast and efficient text search.
CDP-focused Responses: Filters out irrelevant questions and ensures queries stay within the CDP domain.
User-friendly UI: A clean and interactive chat interface with a modern design.
Real-time Typing Indicator: Displays a typing effect when fetching responses.
Keyboard Support: Pressing Enter sends the message.
Mobile & Desktop Support: Responsive design for smooth experience across devices.

1. Tech Stack
Frontend (React)
React.js
Axios (for API requests)
CSS (for styling, no Tailwind)
Backend (Node.js & Express)
Node.js with Express
Lunr.js (for full-text search indexing)
Cheerio & Puppeteer (for web scraping)
Cors & Body-parser

2. Installation & Setup
Prerequisites
Ensure you have the following installed:
Node.js (v18+)
npm or yarn
Clone the Repository
git clone https://github.com/your-repo/cdp-chatbot.git
cd cdp-chatbot

Backend Setup
Navigate to the backend folder:
 cd backend


Install dependencies:
 npm install


Start the server:
 npm start
 The backend should be running at http://localhost:5000.
Frontend Setup
Navigate to the frontend folder:
 cd frontend


Install dependencies:
 npm install


Start the frontend:
 npm start
 The frontend should be running at http://localhost:3000.

3. Backend (API Endpoints)
1. Search API
Endpoint:
POST /search

Request Body:
{
  "question": "How does Segment's audience creation process compare to Lytics?"
}

Response:
{
  "answer": "Segment allows audience creation based on real-time events...",
  "link": "https://segment.com/docs"
}


4. Frontend (React Components)
1. ChatBot.js
Handles user interaction, message sending, and rendering bot responses.
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!question.trim()) return;
    const newMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, newMessage]);
    setQuestion("");
    try {
      const res = await axios.post("http://localhost:5000/search", { question });
      setMessages((prev) => [...prev, { type: "bot", text: res.data.answer, link: res.data.link }]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: "bot", text: "Something went wrong. Try again!" }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
            {msg.link && <a href={msg.link} target="_blank" rel="noopener noreferrer">Read more</a>}
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>
      <div className="input-box">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
}
export default ChatBot;


5. Deployment Guide
Frontend Deployment
You can deploy the React frontend using Vercel or Netlify:
npm run build

Then follow the steps to deploy the build/ folder.
Backend Deployment
For deploying the backend, use Render.com or Vercel:
npm install -g vercel
vercel

Ensure the CORS policy is updated for production.

6. Future Enhancements
AI-powered Search: Replace Lunr.js with OpenAI API for smarter results.
More CDP Providers: Expand the dataset with more CDP vendors.
Voice Input: Allow users to ask questions using voice commands.
Authentication: Add user login to save chat history.

7. Conclusion
This chatbot provides a streamlined way to search CDP-related content and get accurate answers. With a simple interface, fast search, and clean UI, it delivers an efficient experience for users exploring Customer Data Platforms. 🚀


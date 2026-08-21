import { useState, useRef, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Chat.css";

function Chat() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Hello! I'm your AI Business Assistant. Ask me anything about your business data and analytics.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    console.log("SEND BUTTON CLICKED");

    const question = input.trim();

    if (!question || loading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: question,
      },
    ]);

    // Clear input
    setInput("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      console.log("API URL:", API_URL);
      console.log("Chat URL:", `${API_URL}/api/chat`);
      console.log("Question:", question);

      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: question,
          }),
        }
      );

      // Read response safely
      const responseText = await response.text();

      console.log("Chat Status:", response.status);
      console.log("Chat Raw Response:", responseText);

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          throw new Error(
            `Backend returned invalid JSON: ${responseText.substring(
              0,
              200
            )}`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      const aiReply =
        data?.answer ||
        data?.data?.aiResponse ||
        data?.aiResponse ||
        data?.message ||
        "I couldn't generate an answer.";

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: aiReply,
        },
      ]);
    } catch (error) {
      console.error("Chat API Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: `❌ API Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">
          <div className="chat-container">
            <h1>🤖 AI Assistant</h1>

            <p>
              Ask questions about your business and analytics.
            </p>

            <div
              className="chat-box"
              ref={chatBoxRef}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.type}`}
                >
                  {message.type === "ai" && "🤖 "}
                  {message.type === "user" && "👤 "}
                  {message.text}
                </div>
              ))}

              {loading && (
                <div className="message ai">
                  🤖 Thinking...
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
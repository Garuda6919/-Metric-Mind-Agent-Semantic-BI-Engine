import { useState, useRef, useEffect } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Chat.css";

function Chat() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text:
        "👋 Hello! I'm your AI Business Assistant. Ask me anything about your business data and analytics.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    console.log("=================================");
    console.log("SEND BUTTON CLICKED");

    const question = input.trim();

    // Don't send empty message
    if (!question || loading) {
      return;
    }

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: question,
      },
    ]);

    // Clear input
    setInput("");

    // Show thinking
    setLoading(true);

    try {
      // Get production backend URL
      const API_URL = (
        import.meta.env.VITE_API_URL || ""
      ).replace(/\/+$/, "");

      if (!API_URL) {
        throw new Error(
          "VITE_API_URL is not configured."
        );
      }

      const chatURL = `${API_URL}/api/chat`;

      console.log("API URL:", API_URL);
      console.log("Chat URL:", chatURL);
      console.log("Question:", question);

      // Send request to backend
      const response = await fetch(chatURL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          // IMPORTANT:
          // Backend expects "question", not "message"
          question: question,
        }),
      });

      // Read response as text first
      // This prevents Unexpected end of JSON input
      const responseText = await response.text();

      console.log("Chat Status:", response.status);
      console.log("Chat Raw Response:", responseText);

      let data = {};

      // Parse JSON safely
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error(
            "JSON Parse Error:",
            jsonError
          );

          throw new Error(
            `Backend returned invalid JSON: ${responseText.substring(
              0,
              300
            )}`
          );
        }
      }

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        );
      }

      // Get AI response from possible backend formats
      const aiReply =
        data?.answer ||
        data?.data?.answer ||
        data?.data?.aiResponse ||
        data?.aiResponse ||
        data?.response ||
        data?.message ||
        "I couldn't generate an answer.";

      console.log("AI RESPONSE:", aiReply);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: String(aiReply),
        },
      ]);
    } catch (error) {
      console.error("Chat API Error:", error);

      // Show error inside chat
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: `❌ API Error: ${
            error?.message || "Unable to connect to backend"
          }`,
        },
      ]);
    } finally {
      setLoading(false);

      console.log("CHAT REQUEST FINISHED");
      console.log("=================================");
    }
  };

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!loading && input.trim()) {
        sendMessage();
      }
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">
          <div className="chat-container">

            {/* Header */}
            <h1>🤖 AI Assistant</h1>

            <p>
              Ask questions about your business and
              analytics.
            </p>

            {/* Chat messages */}
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

              {/* Loading */}
              {loading && (
                <div className="message ai">
                  🤖 Thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading || !input.trim()
                }
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
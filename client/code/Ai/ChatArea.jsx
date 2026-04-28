import React, { useEffect, useRef, useState } from "react";
import { Message, TypingIndicator } from "./Message";
import "./Main.css";

const API_URL = "https://ai-bot-gamma-six.vercel.app/first";

export default function ChatArea({ activeId, sessions, onUpdate }) {
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef         = useRef(null);
  const textareaRef            = useRef(null);

  const messages = sessions[activeId]?.messages || [];

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  function handleInputChange(e) {
    setInput(e.target.value);
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || !activeId || loading) return;

    // Optimistically add user message
    onUpdate(activeId, { role: "user", text: msg });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeId, msg }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const answer = await res.text();
      onUpdate(activeId, { role: "ai", text: answer });
    } catch (err) {
      onUpdate(activeId, {
        role: "ai",
        text: `⚠ Could not reach the server.\n${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    if (!activeId) return;
    if (window.confirm("Clear this session's history?")) {
      onUpdate(activeId, null); // null = clear signal
    }
  }

  return (
    <main className="chat-area">
      {/* Header */}
      <header className="chat-area__header">
        <div className="chat-area__header-left">
          <div className="chat-area__status-dot" />
          <span className="chat-area__model-name"> · Live</span>
        </div>
        <button className="chat-area__clear-btn" onClick={clearChat}>
          ⌫ Clear
        </button>
      </header>

      {/* Messages */}
      <div className="chat-area__messages">
        {messages.length === 0 && !loading ? (
          <div className="chat-area__empty">
            <span className="chat-area__empty-icon">⬡</span>
            <p className="chat-area__empty-title">Start a conversation</p>
            <span className="chat-area__empty-sub">Your history will appear here.</span>
          </div>
        ) : (
          messages.map((m, i) => (
            <Message key={i} role={m.role} text={m.text} />
          ))
        )}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <footer className="chat-area__input-footer">
        <div className="chat-area__input-box">
          <textarea
            ref={textareaRef}
            className="chat-area__textarea"
            rows={1}
            placeholder="Ask anything… (Enter to send)"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="chat-area__send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            title="Send"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="chat-area__disclaimer">
          AI responses may be inaccurate. Verify important information.
        </p>
      </footer>
    </main>
  );
}

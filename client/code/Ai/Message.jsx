import React from "react";
import "./Main.css";

export function Message({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`message message--${isUser ? "user" : "ai"}`}>
      <div className="message__avatar">{isUser ? "U" : "AI"}</div>
      <div className="message__bubble">{text}</div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="message message--ai">
      <div className="message__avatar">AI</div>
      <div className="typing-indicator">
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
      </div>
    </div>
  );
}

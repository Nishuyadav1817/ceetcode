import React from "react";
import "./Main.css";

export default function Sidebar({ sessions, activeId, onNew, onSwitch, onDelete }) {
  const ids = Object.keys(sessions).reverse();

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <span className="sidebar__logo-dot" />
          <span className="sidebar__logo-text">Chatw/NY</span>
        </div>
        <button className="sidebar__new-btn" onClick={onNew}>
          ＋ New Session
        </button>
      </div>

      {/* Sessions */}
      <div className="sidebar__label">Sessions</div>
      <ul className="sidebar__list">
        {ids.map((id) => (
          <li
            key={id}
            className={`session-item${id === activeId ? " session-item--active" : ""}`}
            onClick={() => onSwitch(id)}
          >
            <span className="session-item__icon">◈</span>
            <span className="session-item__preview">
              {sessions[id].preview || "New session"}
            </span>
            <button
              className="session-item__delete"
              title="Delete session"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="sidebar__footer">
        <span className="sidebar__uid-label">Active Session ID</span>
        <span className="sidebar__uid-value">{activeId || "—"}</span>
      </div>
    </aside>
  );
}

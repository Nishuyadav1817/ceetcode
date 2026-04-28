import React from "react";
import Sidebar  from "./Sidebar";
import ChatArea from "./ChatArea";
import { useSessions } from "./useSessions";
import "./Main.css";

export default function App() {
  const {
    sessions,
    activeId,
    createSession,
    switchSession,
    deleteSession,
    updateSession,
  } = useSessions();

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNew={() => createSession()}
        onSwitch={switchSession}
        onDelete={deleteSession}
      />
      {activeId && (
        <ChatArea
          activeId={activeId}
          sessions={sessions}
          onUpdate={updateSession}
        />
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY    = "nc_sessions";
const ACTIVE_KEY     = "nc_active_id";

function genId() {
  return "sess_" + Math.random().toString(36).slice(2, 8);
}

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    const a = localStorage.getItem(ACTIVE_KEY);
    return { sessions: s ? JSON.parse(s) : {}, activeId: a || null };
  } catch {
    return { sessions: {}, activeId: null };
  }
}

function save(sessions, activeId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    localStorage.setItem(ACTIVE_KEY, activeId || "");
  } catch {}
}

export function useSessions() {
  const [sessions, setSessions] = useState({});
  const [activeId, setActiveId] = useState(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const { sessions: s, activeId: a } = load();
    if (Object.keys(s).length > 0) {
      setSessions(s);
      setActiveId(a && s[a] ? a : Object.keys(s)[0]);
    } else {
      createSession(s);
    }
  }, []); // eslint-disable-line

  // Persist whenever state changes
  useEffect(() => {
    if (Object.keys(sessions).length > 0) {
      save(sessions, activeId);
    }
  }, [sessions, activeId]);

  function createSession(existingSessions) {
    const id = genId();
    const base = existingSessions || sessions;
    const next = { ...base, [id]: { preview: "New session", messages: [] } };
    setSessions(next);
    setActiveId(id);
    return id;
  }

  function switchSession(id) {
    setActiveId(id);
  }

  function deleteSession(id) {
    const next = { ...sessions };
    delete next[id];

    if (Object.keys(next).length === 0) {
      const newId = genId();
      next[newId] = { preview: "New session", messages: [] };
      setSessions(next);
      setActiveId(newId);
    } else {
      setSessions(next);
      if (activeId === id) {
        setActiveId(Object.keys(next)[0]);
      }
    }
  }

  // Called by ChatArea: msg = { role, text } or null (clear)
  const updateSession = useCallback((id, msg) => {
    setSessions((prev) => {
      const session = prev[id];
      if (!session) return prev;

      // null = clear
      if (msg === null) {
        return { ...prev, [id]: { ...session, messages: [], preview: "New session" } };
      }

      const newMessages = [...session.messages, msg];

      // Update preview from first user message
      const firstUser = newMessages.find((m) => m.role === "user");
      const preview = firstUser
        ? firstUser.text.slice(0, 34) + (firstUser.text.length > 34 ? "…" : "")
        : "New session";

      return { ...prev, [id]: { ...session, messages: newMessages, preview } };
    });
  }, []);

  return { sessions, activeId, createSession, switchSession, deleteSession, updateSession };
}

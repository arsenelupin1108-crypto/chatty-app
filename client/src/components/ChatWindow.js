import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../features/chat/chatSlice";

export default function ChatWindow({ room }) {
  const dispatch = useDispatch();
  const messages = useSelector((s) => s.chat.messagesByRoom[room] || []);
  const typingUsers = useSelector((s) => Object.values(s.chat.typingUsers).filter(u => u.isTyping));
  const ref = useRef();

  useEffect(() => { dispatch(fetchMessages(room)); }, [room, dispatch]);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [messages.length]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: 12, borderBottom: "1px solid #ddd" }}>
        {messages.map(m => (
          <div key={m._id} style={{ opacity: m.optimistic ? 0.6 : 1, marginBottom: 8 }}>
            <strong>{m.user?.username || "?"}:</strong> {m.text}
            <div style={{ fontSize: 11, color: "#888" }}>{new Date(m.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div style={{ minHeight: 22, padding: "4px 8px", color: "#777" }}>
        {typingUsers.length > 0 && `${typingUsers.map(u => u.username).join(", ")} typing...`}
      </div>
    </div>
  );
}

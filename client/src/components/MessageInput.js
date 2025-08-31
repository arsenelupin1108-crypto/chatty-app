import { useDispatch, useSelector } from "react-redux";
import { sendMessage, setTyping } from "../features/chat/chatSlice";
import { useEffect, useState } from "react";

export default function MessageInput({ room }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [text, setText] = useState("");
  const [typing, setTypingLocal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (typing) {
        dispatch(setTyping({ room, isTyping: false }));
        setTypingLocal(false);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [typing, dispatch, room]);

  const onChange = (e) => {
    setText(e.target.value);
    if (!typing) {
      setTypingLocal(true);
      dispatch(setTyping({ room, isTyping: true }));
    }
  };

  const onSend = () => {
    const v = text.trim();
    if (!v) return;
    dispatch(sendMessage({ room, text: v, user }));
    setText("");
    setTypingLocal(false);
    dispatch(setTyping({ room, isTyping: false }));
  };

  return (
    <div style={{ display: "flex", gap: 8, padding: 8 }}>
      <input
        value={text}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder={`Message #${room}`}
        style={{ flex: 1, padding: 8 }}
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
}

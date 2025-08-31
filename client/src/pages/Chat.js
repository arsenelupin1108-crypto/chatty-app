import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { joinRoom } from "../features/chat/chatSlice";
import { logout } from "../features/auth/authSlice";
import RoomList from "../components/RoomList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

export default function Chat() {
  const dispatch = useDispatch();
  const room = useSelector((s) => s.chat.activeRoom);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => { dispatch(joinRoom(room)); }, [dispatch, room]);
  const onSelect = useCallback((r) => dispatch(joinRoom(r)), [dispatch]);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", border: "1px solid #ddd", display: "flex", height: "70vh" }}>
      <RoomList active={room} onSelect={onSelect} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 8, borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" }}>
          <div>Signed in as <strong>{user?.username}</strong> — Room <strong>#{room}</strong></div>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </div>
        <ChatWindow room={room} />
        <MessageInput room={room} />
      </div>
    </div>
  );
}

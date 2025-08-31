import { io } from "socket.io-client";
import { messageAdded, messagesInit, presenceUpdated, typingUpdated, setConnected } from "../features/chat/chatSlice";
import { logout, selectToken } from "../features/auth/authSlice";

let socket = null;

export const socketMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  const token = selectToken(state);

  if (!socket && token) {
    socket = io("http://localhost:5000", { auth: { token } });

    socket.on("connect", () => {
      store.dispatch(setConnected(true));
      socket.emit("room:join", state.chat.activeRoom);
    });

    socket.on("disconnect", () => store.dispatch(setConnected(false)));
    socket.on("message:init", (msgs) => store.dispatch(messagesInit({ room: state.chat.activeRoom, msgs })));
    socket.on("message:new", (msg) => store.dispatch(messageAdded(msg)));
    socket.on("presence:update", (users) => store.dispatch(presenceUpdated(users)));
    socket.on("typing", (payload) => store.dispatch(typingUpdated(payload)));
  }

  if (socket) {
    if (action.type === "chat/joinRoom") socket.emit("room:join", action.payload);
    if (action.type === "chat/sendMessage") socket.emit("message:send", action.payload);
    if (action.type === "chat/setTyping") socket.emit("typing", action.payload);
  }

  if (action.type === logout.type) {
    if (socket) { socket.disconnect(); socket = null; }
  }

  return result;
};

import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

export function registerChatNamespace(io) {
  const onlineByRoom = new Map(); // room -> Map(userId -> username)

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user; // {id, username, email}
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;

    socket.on("room:join", async (room) => {
      socket.join(room);
      if (!onlineByRoom.has(room)) onlineByRoom.set(room, new Map());
      onlineByRoom.get(room).set(user.id, user.username);

      io.to(room).emit("presence:update",
        Array.from(onlineByRoom.get(room), ([id, username]) => ({ id, username }))
      );

      const recent = await Message.find({ room }).sort({ createdAt: -1 }).limit(50);
      socket.emit("message:init", recent.reverse());
    });

    socket.on("room:leave", (room) => {
      socket.leave(room);
      const m = onlineByRoom.get(room);
      if (m) {
        m.delete(user.id);
        io.to(room).emit("presence:update", Array.from(m, ([id, username]) => ({ id, username })));
      }
    });

    socket.on("typing", ({ room, isTyping }) => {
      socket.to(room).emit("typing", { user: { id: user.id, username: user.username }, isTyping });
    });

    socket.on("message:send", async ({ room, text, tempId }) => {
      if (!text?.trim()) return;
      const msg = await Message.create({
        room,
        text,
        user: { id: user.id, username: user.username },
        createdAt: new Date()
      });
      io.to(room).emit("message:new", { ...msg.toObject(), tempId });
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        const m = onlineByRoom.get(room);
        if (m) {
          m.delete(user.id);
          io.to(room).emit("presence:update", Array.from(m, ([id, username]) => ({ id, username })));
        }
      }
    });
  });
}

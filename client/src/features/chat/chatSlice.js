import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (room = "general") => {
  const { data } = await api.get(`/messages?room=${encodeURIComponent(room)}&limit=50`);
  return { room, msgs: data };
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    connected: false,
    activeRoom: "general",
    messagesByRoom: { general: [] },
    presence: [],
    typingUsers: {}
  },
  reducers: {
    setConnected(state, { payload }) { state.connected = payload; },
    joinRoom(state, { payload: room }) {
      state.activeRoom = room;
      state.messagesByRoom[room] ??= [];
    },
    leaveRoom() {},
    sendMessage: {
      reducer(state, { payload }) {
        const { room, text, tempId, user } = payload;
        state.messagesByRoom[room] ??= [];
        state.messagesByRoom[room].push({ _id: tempId, room, text, user, createdAt: new Date().toISOString(), optimistic: true });
      },
      prepare({ room, text, user }) {
        return { payload: { room, text, user, tempId: nanoid() } };
      }
    },
    messagesInit(state, { payload: { room, msgs } }) {
      state.messagesByRoom[room] = msgs;
    },
    messageAdded(state, { payload }) {
      const room = payload.room;
      state.messagesByRoom[room] ??= [];
      if (payload.tempId) {
        const idx = state.messagesByRoom[room].findIndex(m => m._id === payload.tempId);
        if (idx !== -1) state.messagesByRoom[room][idx] = payload;
        else state.messagesByRoom[room].push(payload);
      } else {
        state.messagesByRoom[room].push(payload);
      }
    },
    presenceUpdated(state, { payload: users }) {
      state.presence = users;
    },
    setTyping() {},
    typingUpdated(state, { payload }) {
      const { user, isTyping } = payload;
      state.typingUsers[user.id] = { ...user, isTyping };
    },
    clearTyping(state) { state.typingUsers = {}; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, { payload }) => {
      state.messagesByRoom[payload.room] = payload.msgs;
    });
  }
});

export const {
  setConnected, joinRoom, leaveRoom,
  sendMessage, messagesInit, messageAdded,
  presenceUpdated, setTyping, typingUpdated, clearTyping
} = chatSlice.actions;

export default chatSlice.reducer;

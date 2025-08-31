import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: String, index: true, default: "general" },
  text: { type: String, required: true },
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);

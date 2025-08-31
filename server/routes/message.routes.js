import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import Message from "../models/Message.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  const { room = "general", limit = 50 } = req.query;
  const msgs = await Message.find({ room }).sort({ createdAt: -1 }).limit(Number(limit));
  res.json(msgs.reverse());
});

export default router;

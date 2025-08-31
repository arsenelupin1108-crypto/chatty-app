import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

const sign = (user) =>
  jwt.sign({ id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1d" });

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();
    const token = sign(user);
    res.status(201).json({ token, user: { id: user._id, username, email }});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});






router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const query = emailOrUsername.includes("@")
      ? { email: emailOrUsername }
      : { username: emailOrUsername };

    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

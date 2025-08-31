import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    const conn = await mongoose.connect(uri);
    console.log("✅ MongoDB:", conn.connection.host);
  } catch (e) {
    console.error("❌ Mongo error:", e.message);
    process.exit(1);
  }
}

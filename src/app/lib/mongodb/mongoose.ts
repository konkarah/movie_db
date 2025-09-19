// lib/mongodb/mongoose.ts
import mongoose from "mongoose";

let isConnected = false;

export const connect = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "new-next-imb",
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Database connection failed"); // Throw error to handle it properly
  }
};
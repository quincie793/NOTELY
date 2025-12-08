import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // <-- add this
import { prisma } from "./libraries/prisma"; 
import app from "./app";

// Middleware
app.use(express.json());
app.use(cookieParser());

// 🔑 Enable CORS here
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // allow your frontend dev servers
    credentials: true, // allow cookies/authorization headers
  })
);

// Example route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Notely API 🚀" });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

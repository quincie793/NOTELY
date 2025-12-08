import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import entryRoutes from "./routes/entry.routes";
import userRoutes from "./routes/user.routes"; // 🆕 import user routes

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", entryRoutes);
app.use("/api/user", userRoutes); // 🆕 register user routes

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default app;

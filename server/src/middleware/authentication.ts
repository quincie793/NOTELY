import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Login required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as any;

    // thanks to augmentation, req.user is now valid
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

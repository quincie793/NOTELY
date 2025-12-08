import type { Request, Response } from "express";
import { prisma } from "../libraries/prisma";
import { hashPassword, verifyPassword } from "../libraries/hash";
import jwt from "jsonwebtoken";

// REGISTER
export async function register(req: Request, res: Response) {
  const { firstName, lastName, username, email, password } = req.body;

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (exists) return res.status(409).json({ error: "Email or username already exists" });

  const passwordHash = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: { firstName, lastName, username, email, passwordHash },
  });

  // ✅ Return the created user object
  res.status(201).json({
    message: "Registered successfully",
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
    },
  });
}


// LOGIN
export async function login(req: Request, res: Response) {
  const { identifier, password } = req.body as { identifier: string; password: string };

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }], isDeleted: false },
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false });

  // ✅ Return user object along with message and token
  res.json({
    message: "Logged in",
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });
}

// LOGOUT
export async function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}

export async function updatePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new passwords required" });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "Incorrect current password" });

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

  res.status(204).send();
}

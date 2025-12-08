// controllers/user.controller.ts
import { Request, Response } from "express";
import { prisma } from "../libraries/prisma";

export async function updateUser(req: Request, res: Response) {
  const { firstName, lastName, username, email, avatarUrl } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { firstName, lastName, username, email, avatarUrl },
  });

  res.json({
    message: "Profile updated",
    data: {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      username: updated.username,
      email: updated.email,
      avatarUrl: updated.avatarUrl,
    },
  });
}

import { Request, Response } from "express";
import { prisma } from "../libraries/prisma"; // make sure this file exists

export async function createEntry(req: Request, res: Response) {
  const { title, synopsis, content } = req.body as {
    title: string;
    synopsis: string;
    content: string;
  };

  const entry = await prisma.entry.create({
    data: {
      title,
      synopsis,
      content,
      userId: req.user!.id, // req.user comes from your auth middleware
    },
  });

  res.status(201).json({ data: entry });
}

export async function listEntries(req: Request, res: Response) {
  const entries = await prisma.entry.findMany({
    where: { userId: req.user!.id, isDeleted: false },
  });
  res.json({ data: entries });
}

export async function deleteEntry(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const entry = await prisma.entry.update({
      where: { id }, // UUID string
      data: { isDeleted: true },
    });
    res.json({ message: "Moved to trash", data: entry });
  } catch (err) {
    res.status(404).json({ error: "Entry not found" });
  }
}

export async function getEntry(req: Request, res: Response) {
  const { id } = req.params;

  const entry = await prisma.entry.findFirst({
    where: { id, userId: req.user!.id, isDeleted: false },
  });

  if (!entry) return res.status(404).json({ error: "Entry not found" });
  res.json({ data: entry });
}

export async function updateEntry(req: Request, res: Response) {
  const { id } = req.params;
  const { title, synopsis, content } = req.body;

  const entry = await prisma.entry.findFirst({
    where: { id, userId: req.user!.id, isDeleted: false },
  });

  if (!entry) return res.status(404).json({ error: "Entry not found" });

  const updated = await prisma.entry.update({
    where: { id },
    data: {
      title: title ?? entry.title,
      synopsis: synopsis ?? entry.synopsis,
      content: content ?? entry.content,
    },
  });

  res.json({ message: "Updated", data: updated });
}

export async function listTrash(req: Request, res: Response) {
  const entries = await prisma.entry.findMany({
    where: { userId: req.user!.id, isDeleted: true },
    orderBy: { lastUpdated: "desc" },
  });

  res.json({ data: entries });
}

export async function restoreEntry(req: Request, res: Response) {
  const { id } = req.params;

  const entry = await prisma.entry.findFirst({
    where: { id, userId: req.user!.id, isDeleted: true },
  });

  if (!entry) return res.status(404).json({ error: "Entry not found in trash" });

  const restored = await prisma.entry.update({
    where: { id },
    data: { isDeleted: false },
  });

  res.json({ message: "Restored", data: restored });
}

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
    orderBy: [
      { pinned: "desc" },       // ✅ pinned entries first
      { dateCreated: "desc" }
    ],
  });
  res.json({ data: entries });
}

// ✅ Toggle pin
export async function togglePin(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const entry = await prisma.entry.update({
      where: { id },
      data: { pinned: { set: req.body.pinned } }, // expects boolean
    });
    res.json({ message: "Pin updated", data: entry });
  } catch {
    res.status(404).json({ error: "Entry not found" });
  }
}

// ✅ Toggle bookmark
export async function toggleBookmark(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const entry = await prisma.entry.update({
      where: { id },
      data: { bookmarked: { set: req.body.bookmarked } }, // expects boolean
    });
    res.json({ message: "Bookmark updated", data: entry });
  } catch {
    res.status(404).json({ error: "Entry not found" });
  }
}

// ✅ List bookmarked entries
export async function listBookmarks(req: Request, res: Response) {
  const entries = await prisma.entry.findMany({
    where: { userId: req.user!.id, bookmarked: true, isDeleted: false },
    orderBy: { dateCreated: "desc" },
  });
  res.json({ data: entries });
}

export async function listPinned(req: Request, res: Response) {
  const entries = await prisma.entry.findMany({
    where: { userId: req.user!.id, pinned: true, isDeleted: false },
    orderBy: { dateCreated: "desc" },
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

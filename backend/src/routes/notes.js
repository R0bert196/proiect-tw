import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

// Get all notes for logged in user
router.get("/", authMiddleware, async (req, res) => {
  const notes = await prisma.note.findMany({ where: { userId: req.user.id } });
  res.json(notes);
});

// Create note
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: "Titlu și conținut necesare" });

  const note = await prisma.note.create({
    data: { title, content, userId: req.user.id },
  });
  res.json(note);
});

// Update note
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content, completed } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: "Titlu și conținut necesare" });

  const note = await prisma.note.update({
    where: { id: Number(req.params.id) },
    data: { title, content, completed },
  });
  res.json(note);
});

// Delete note
router.delete("/:id", authMiddleware, async (req, res) => {
  await prisma.note.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Deleted" });
});

export default router;

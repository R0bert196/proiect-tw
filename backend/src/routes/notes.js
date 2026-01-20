import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

// Get all notes for logged in user (include repo)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      include: { repo: true }, // include repo pentru frontend
    });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la încărcarea notițelor" });
  }
});

// Create note
router.post("/", authMiddleware, async (req, res) => {
  const { title, content, repoId } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: "Titlu și conținut sunt necesare" });

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.user.id,
        repoId: repoId || null, // poate fi null dacă nu selectezi repo
      },
      include: { repo: true }, // returnează repo-ul creat asociat
    });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la crearea notei" });
  }
});

// Update note (permis și repoId)
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content, completed, repoId } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: "Titlu și conținut necesare" });

  try {
    const note = await prisma.note.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        content,
        completed,
        repoId: repoId || null, // permite schimbarea repo-ului
      },
      include: { repo: true }, // returnează repo-ul asociat
    });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la actualizarea notei" });
  }
});

// Delete note (nu afectează repo)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.note.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la ștergerea notei" });
  }
});

export default router;

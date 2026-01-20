import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

// Get all repos for logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const repos = await prisma.gitHubRepo.findMany({
      where: { userId: req.user.id },
    });
    res.json(repos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la preluarea repo-urilor" });
  }
});

// Add new repo
router.post("/", authMiddleware, async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url)
    return res.status(400).json({ message: "Name și URL sunt necesare" });

  try {
    const repo = await prisma.gitHubRepo.create({
      data: {
        name,
        url,
        userId: req.user.id, // asociez repo-ul cu userul logat
      },
    });
    res.json(repo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la crearea repo-ului" });
  }
});

// Delete repo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.gitHubRepo.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la ștergerea repo-ului" });
  }
});

// Update repo (opțional)
router.put("/:id", authMiddleware, async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url)
    return res.status(400).json({ message: "Name și URL necesare" });

  try {
    const repo = await prisma.gitHubRepo.update({
      where: { id: Number(req.params.id) },
      data: { name, url },
    });
    res.json(repo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la actualizarea repo-ului" });
  }
});

export default router;

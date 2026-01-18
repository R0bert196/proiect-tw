import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
  res.json(tasks);
});

// Create task
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;
  const task = await prisma.task.create({
    data: { title, userId: req.user.id },
  });
  res.json(task);
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { title, completed },
  });
  res.json(task);
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: Number(id) } });
  res.json({ message: "Deleted" });
});

export default router;

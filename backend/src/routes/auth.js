import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

export const prisma = new PrismaClient({ adapter });

// Register
router.post("/register", async (req, res) => {
  console.log(req.body); // verifică ce primește backend
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email și parola sunt necesare" });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { email, password: hash } });
    res.json({ message: "User created" });
  } catch (err) {
    console.error("Register error:", err); // <--- log real
    res.status(500).json({ message: "A apărut o eroare la crearea userului" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", {
    expiresIn: "1h",
  });
  res.json({ token });
});

export default router;

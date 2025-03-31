import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para JSON
app.use(express.json());

app.post("/usuarios", async (req, res) => {
  const { name, phone, address } = req.body;
  if (!name || !phone || !address) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }
  const user = await prisma.user.create({
    data: { name: name, phone, address },
  });
  res.status(201).json(user);
});

app.get("/usuarios", async (req, res) => {
  let users = [];
  if (req.query.name || req.query.phone || req.query.address) {
    users = await prisma.user.findMany({
      where: {
        name: req.query.name || undefined,
        phone: req.query.phone || undefined,
        address: req.query.address || undefined,
      },
    });
  } else {
    users = await prisma.user.findMany();
  }
  res.status(200).json(users);
});

app.put("/usuarios/:id", async (req, res) => {
  const id = req.params.id;
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    },
  });
  res.status(201).json(updatedUser);
});

app.delete("/usuarios/:id", async (req, res) => {
    const id = req.params.id
  await prisma.user.delete({
    where: { id },
  });
  res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

app.listen(3000, async () => {
  try {
    await prisma.$connect();
    console.log("Servidor rodando na porta 3000 e conectado ao banco de dados");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
});

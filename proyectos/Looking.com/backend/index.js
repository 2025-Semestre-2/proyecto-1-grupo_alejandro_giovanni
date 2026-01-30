import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getConnection, sql } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/whoami", (req, res) => {
  res.send({ user: process.env.USERNAME || process.env.USER });
});

app.get("/", (req, res) => {
  res.json({ status: "Backend funciona" });
});

app.get("/db-test", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT 1 AS ok");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ DB ERROR FULL:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

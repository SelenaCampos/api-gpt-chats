import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint para listar chats
app.get("/api/chats", async (req, res) => {
  const { tema } = req.query;

  let query = supabase.from("chats_gpt").select("*");

  if (tema) {
    query = query.ilike("tema", `%${tema}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar chats" });
  }

  res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

export default app;

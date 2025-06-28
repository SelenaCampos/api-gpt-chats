import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Inserir chat
app.post('/chats', async (req, res) => {
  const { titulo, conteudo, tema } = req.body;

  const { data, error } = await supabase
    .from('chats_gpt')
    .insert([{ titulo, conteudo, tema }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ data });
});

// Buscar chats filtrados
app.get('/chats', async (req, res) => {
  const { tema } = req.query;

  let query = supabase.from('chats_gpt').select('*');

  if (tema) {
    query = query.ilike('tema', `%${tema}%`);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

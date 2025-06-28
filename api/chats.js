import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { titulo, conteudo, tema } = req.body;

    if (!titulo || !conteudo || !tema) {
      return res.status(400).json({ error: 'Campos obrigatórios: titulo, conteudo, tema' });
    }

    const { data, error } = await supabase
      .from('chats_gpt')
      .insert([{ titulo, conteudo, tema }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ data });
  } else if (req.method === 'GET') {
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


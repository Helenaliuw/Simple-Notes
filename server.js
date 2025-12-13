
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client on the Server Side
// Note: We use process.env here, NOT import.meta.env
// The keys in .env should ideally be named SUPABASE_URL and SUPABASE_KEY (without VITE_)
// But for compatibility with your existing .env, we can read the VITE_ prefixed ones too.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and Key are missing from .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Fetch all notes
app.get('/api/notes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create a new note
app.post('/api/notes', async (req, res) => {
  const { title, description } = req.body;
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, description: description || null }])
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a note
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const { data, error } = await supabase
      .from('notes')
      .update({ title, description: description || null })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});

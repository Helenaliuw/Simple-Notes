
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabase';
import { Note } from './types';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import { PostgrestError } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State for editing
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setNotes(data || []);
    } catch (err) {
      const pgError = err as PostgrestError;
      console.error('Error fetching notes:', pgError);
      setError(`Gagal memuat catatan: ${pgError.message}. Pastikan setup Supabase sudah benar (lihat README.md).`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('notes')
        .insert([{ title, description: description || null }]);

      if (error) {
        throw error;
      }

      setTitle('');
      setDescription('');
      await fetchNotes(); // Refresh the list
    } catch (err) {
        const pgError = err as PostgrestError;
        console.error('Error saving note:', pgError);
        
        if (pgError.message && pgError.message.includes('row-level security policy')) {
            setError('Gagal menyimpan: Akses ditolak oleh database. Pastikan Anda sudah membuat Policy "INSERT" untuk role "anon" di dashboard Supabase.');
        } else {
            setError(`Gagal menyimpan catatan: ${pgError.message}.`);
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
    setEditingDescription(note.description || '');
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const handleUpdate = async (noteId: string) => {
    if (!editingTitle.trim()) {
      setError('Judul edit tidak boleh kosong.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title: editingTitle, description: editingDescription || null })
        .eq('id', noteId);
      
      if (error) throw error;
      
      handleCancelEdit();
      await fetchNotes();
    } catch (err) {
      const pgError = err as PostgrestError;
      if (pgError.message && pgError.message.includes('row-level security policy')) {
          setError('Gagal mengupdate: Pastikan Policy "UPDATE" sudah dibuat di Supabase.');
      } else {
          setError(`Gagal memperbarui catatan: ${pgError.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      setIsLoading(true);
      setError(null);
      try {
        const { error } = await supabase.from('notes').delete().eq('id', noteId);
        if (error) throw error;
        await fetchNotes();
      } catch (err) {
        const pgError = err as PostgrestError;
        if (pgError.message && pgError.message.includes('row-level security policy')) {
            setError('Gagal menghapus: Pastikan Policy "DELETE" sudah dibuat di Supabase.');
        } else {
            setError(`Gagal menghapus catatan: ${pgError.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.description &&
        note.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 py-2">
            Simple Notes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Aplikasi client-server sederhana dengan React dan Supabase.</p>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:pr-6">
             <NoteForm 
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isEditing={!!editingNoteId}
              />
          </div>
          <div className="lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 pt-8 lg:pt-0">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            <NoteList 
                notes={filteredNotes}
                totalNotes={notes.length}
                isLoading={isLoading && notes.length === 0}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                editingNoteId={editingNoteId}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                editingDescription={editingDescription}
                setEditingDescription={setEditingDescription}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onCancelEdit={handleCancelEdit}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

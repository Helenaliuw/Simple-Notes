
import React, { useState, useEffect, useCallback } from 'react';
import { noteService } from './services/api';
import { Note } from './types';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State for editing
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setServerError(false);
    try {
      const data = await noteService.getAll();
      setNotes(data || []);
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      // Check if it's a connection error (Server not running)
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('Network request failed'))) {
        setServerError(true);
        setError('Gagal menghubungi server backend. Pastikan Anda telah menjalankan "node server.js".');
      } else {
        setError(`Gagal memuat catatan: ${err.message}`);
      }
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
      await noteService.create({ title, description });
      setTitle('');
      setDescription('');
      await fetchNotes(); // Refresh the list
    } catch (err: any) {
        console.error('Error saving note:', err);
        setError(`Gagal menyimpan catatan: ${err.message}.`);
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
      await noteService.update(noteId, { title: editingTitle, description: editingDescription });
      handleCancelEdit();
      await fetchNotes();
    } catch (err: any) {
      setError(`Gagal memperbarui catatan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      setIsLoading(true);
      setError(null);
      try {
        await noteService.delete(noteId);
        await fetchNotes();
      } catch (err: any) {
        setError(`Gagal menghapus catatan: ${err.message}`);
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
            Secure Notes App
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
             Arsitektur Client-Server (Proxy Backend). API Key tersembunyi di server.
          </p>
        </header>

        {serverError && (
            <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg mb-8 text-center animate-pulse">
                <h3 className="text-xl font-bold mb-2">⚠️ Koneksi Server Terputus</h3>
                <p>Aplikasi tidak dapat menghubungi backend.</p>
                <p className="mt-2 text-sm bg-red-700 inline-block px-3 py-1 rounded">
                    Jalankan perintah: <code>node server.js</code> di terminal.
                </p>
            </div>
        )}
        
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
            {error && !serverError && (
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

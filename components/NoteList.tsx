
import React, { useState } from 'react';
import { Note } from '../types';

interface NoteListProps {
    notes: Note[];
    totalNotes: number;
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    // Props for editing
    editingNoteId: string | null;
    editingTitle: string;
    setEditingTitle: (title: string) => void;
    editingDescription: string;
    setEditingDescription: (description: string) => void;
    onEdit: (note: Note) => void;
    onUpdate: (noteId: string) => Promise<void>;
    onDelete: (noteId: string) => Promise<void>;
    onCancelEdit: () => void;
}

interface NoteItemProps {
    note: Note;
    isEditing: boolean;
    editingTitle: string;
    setEditingTitle: (title: string) => void;
    editingDescription: string;
    setEditingDescription: (description: string) => void;
    onEdit: (note: Note) => void;
    onUpdate: (noteId: string) => Promise<void>;
    onDelete: (noteId: string) => Promise<void>;
    onCancelEdit: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ 
    note, isEditing, editingTitle, setEditingTitle, editingDescription, setEditingDescription,
    onEdit, onUpdate, onDelete, onCancelEdit 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 100;

    const hasLongDescription = note.description && note.description.length > MAX_LENGTH;
    const toggleExpand = () => setIsExpanded(!isExpanded);

    // Edit Mode View
    if (isEditing) {
        return (
             <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg ring-2 ring-emerald-500/80 flex flex-col">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Judul</label>
                        <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm"
                        />
                    </div>
                    <div>
                         <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Keterangan</label>
                        <textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            rows={4}
                            className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button 
                            onClick={onCancelEdit}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={() => onUpdate(note.id)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
             </div>
        )
    }

    // Normal View
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col group relative">
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-emerald-600 dark:text-emerald-400 break-words pr-16">{note.title}</h3>
                
                {note.description && (
                    <div className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                        <p>
                            {isExpanded || !hasLongDescription
                                ? note.description
                                : `${note.description.substring(0, MAX_LENGTH)}...`}
                        </p>
                        
                        {hasLongDescription && (
                            <button 
                                onClick={toggleExpand}
                                className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 focus:outline-none hover:underline transition-colors"
                            >
                                {isExpanded ? "Sembunyikan" : "Selengkapnya"}
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(note.created_at).toLocaleString()}
                </p>
                
                <div className="flex space-x-1">
                    <button 
                        onClick={() => onEdit(note)} 
                        className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-all"
                        title="Edit Catatan"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => onDelete(note.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
                        title="Hapus Catatan"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const LoadingSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4 ml-auto"></div>
    </div>
);

const NoteList: React.FC<NoteListProps> = ({ 
    notes, totalNotes, isLoading, searchTerm, onSearchChange, 
    editingNoteId, editingTitle, setEditingTitle, editingDescription, setEditingDescription,
    onEdit, onUpdate, onDelete, onCancelEdit
}) => {
    
    const renderEmptyState = () => {
        if (totalNotes > 0 && notes.length === 0) {
            return (
                 <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Tidak Ada Hasil</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tidak ada catatan yang cocok dengan pencarian Anda.</p>
                </div>
            );
        }

        if (totalNotes === 0) {
            return (
                <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Belum ada catatan</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Buat catatan baru untuk memulai.</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Daftar Catatan</h2>

            <div className="relative mb-4">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="search"
                    placeholder="Cari berdasarkan judul atau keterangan..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    aria-label="Cari catatan"
                />
            </div>
            
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 pb-4">
                {isLoading && (
                    <>
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </>
                )}
                {!isLoading && notes.length > 0 && notes.map((note) => (
                    <NoteItem 
                        key={note.id} 
                        note={note} 
                        isEditing={editingNoteId === note.id}
                        editingTitle={editingTitle}
                        setEditingTitle={setEditingTitle}
                        editingDescription={editingDescription}
                        setEditingDescription={setEditingDescription}
                        onEdit={onEdit}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onCancelEdit={onCancelEdit}
                    />
                ))}
                {!isLoading && notes.length === 0 && renderEmptyState()}
            </div>
        </div>
    );
};

export default NoteList;

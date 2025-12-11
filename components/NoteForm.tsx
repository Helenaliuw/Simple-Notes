
import React from 'react';

interface NoteFormProps {
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    isEditing?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ title, setTitle, description, setDescription, handleSubmit, isLoading, isEditing = false }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-opacity duration-300 ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">
                {isEditing ? 'Selesaikan Edit...' : 'Tambah Catatan Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                        Judul
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700"
                        placeholder="Judul catatan..."
                        required
                        disabled={isEditing}
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                        Keterangan
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700"
                        placeholder="Isi keterangan..."
                        disabled={isEditing}
                    />
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || isEditing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? (
                           <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                           </>
                        ) : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoteForm;

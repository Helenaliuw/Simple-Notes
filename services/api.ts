
import { Note } from '../types';

// Helper to handle response errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || response.statusText || 'Network response was not ok');
  }
  // For 204 No Content
  if (response.status === 204) return null;
  return response.json();
};

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    const response = await fetch('/api/notes');
    return handleResponse(response);
  },

  create: async (note: { title: string; description: string }): Promise<Note[]> => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    return handleResponse(response);
  },

  update: async (id: string, note: { title: string; description: string }): Promise<Note[]> => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

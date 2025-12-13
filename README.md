
# Secure Supabase Notes App (Client-Server Architecture)

Aplikasi ini menggunakan arsitektur **Backend-for-Frontend (BFF)**.
React (Frontend) tidak lagi terhubung langsung ke Supabase. Sebaliknya, Frontend merequest data ke server Express.js lokal, yang kemudian menghubungi Supabase.

Dengan cara ini, **API Key Supabase tidak pernah terekspose ke browser pengguna**.

## Prasyarat

Pastikan Anda memiliki Node.js terinstal.

Anda perlu menginstall dependensi tambahan untuk backend:

```bash
npm install express cors dotenv @supabase/supabase-js
```

## Setup Environment Variables

Buat file `.env` di root project:

```
# Digunakan oleh Server (Node.js)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Digunakan oleh Vite (opsional, jika masih ada kode legacy)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Cara Menjalankan Aplikasi

Anda perlu menjalankan **dua** proses terminal secara bersamaan:

1.  **Terminal 1 (Backend Server):**
    Menjalankan server Express di port 3000.
    ```bash
    node server.js
    ```

2.  **Terminal 2 (Frontend React):**
    Menjalankan Vite development server.
    ```bash
    npm run dev
    ```

Akses aplikasi di URL yang diberikan oleh Vite (biasanya `http://localhost:5173`). Vite dikonfigurasi untuk mem-proxy request `/api` ke `http://localhost:3000`.

## Struktur Project Baru

*   **`server.js`**: Kode Backend (Express). Menangani auth Supabase dan routing API.
*   **`services/api.ts`**: Kode Frontend. Menghubungi `server.js` via fetch.
*   **`App.tsx`**: UI Logic.

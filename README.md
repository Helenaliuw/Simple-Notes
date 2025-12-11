
# Supabase Notes App

This is a React application that allows users to create and view notes. The data is persisted in a Supabase cloud database.

## Supabase Setup Guide

To run this application, you need to set up a Supabase project and a `notes` table.

### 1. Create a Supabase Project

- Go to [supabase.com](https://supabase.com/) and create a new project.
- Once the project is created, navigate to the **Project Settings**.

### 2. Get API Keys

- In your project settings, go to the **API** section.
- You will find your **Project URL** and your `anon` **public** key. You will need these for your environment variables.

### 3. Create the `notes` Table

- Go to the **Table Editor** in the Supabase dashboard.
- Click **"Create a new table"**.
- Name the table `notes`.
- Make sure **"Enable Row Level Security (RLS)"** is checked.
- Add the following columns:
    - `id`: `uuid` (This is the primary key, it should be pre-configured).
    - `created_at`: `timestamptz` (with default value `now()`).
    - `title`: `text` (cannot be null).
    - `description`: `text`.
- Click **Save** to create the table.

### 4. Enable Public Access (for this demo)

For this simple application, we will allow anyone to read, write, edit, and delete the `notes` table. 
**For a production application, you should implement proper authentication and stricter policies.**

- In the Supabase dashboard, go to **Authentication** -> **Policies**.
- Select the `notes` table.

**Create Policy for SELECT (Read):**
- Click **"New Policy"** -> **"Create a new policy from scratch"**.
    - **Policy Name**: `Allow public read access`
    - **Allowed operation**: `SELECT`
    - **Target roles**: `anon`
    - **USING expression**: `true`
- Click **"Review"** and then **"Save policy"**.

**Create Policy for INSERT (Create):**
- Click **"New Policy"** -> **"Create a new policy from scratch"**.
    - **Policy Name**: `Allow public insert access`
    - **Allowed operation**: `INSERT`
    - **Target roles**: `anon`
    - **WITH CHECK expression**: `true`
- Click **"Review"** and then **"Save policy"**.

**Create Policy for UPDATE (Edit):**
- Click **"New Policy"** -> **"Create a new policy from scratch"**.
    - **Policy Name**: `Allow public update access`
    - **Allowed operation**: `UPDATE`
    - **Target roles**: `anon`
    - **USING expression**: `true`
    - **WITH CHECK expression**: `true`
- Click **"Review"** and then **"Save policy"**.

**Create Policy for DELETE (Remove):**
- Click **"New Policy"** -> **"Create a new policy from scratch"**.
    - **Policy Name**: `Allow public delete access`
    - **Allowed operation**: `DELETE`
    - **Target roles**: `anon`
    - **USING expression**: `true`
- Click **"Review"** and then **"Save policy"**.

### 5. Set Up Environment Variables

This application reads the Supabase URL and Key from environment variables. In a local development environment, you can create a file named `.env` in the root of your project.

**DO NOT COMMIT THIS FILE TO GIT!**

Add the following lines to your `.env` file, replacing the placeholders with your actual Supabase Project URL and Anon Key:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

Now the application should be able to connect to your Supabase backend.

## Troubleshooting

### Error: "new row violates row-level security policy"

Jika Anda melihat error ini saat menyimpan, mengedit, atau menghapus data, artinya Policy Supabase Anda belum diatur dengan benar.

1. Buka Dashboard Supabase Anda -> menu **Authentication** -> **Policies**.
2. Pilih tabel `notes`.
3. Pastikan Anda memiliki 4 policy terpisah untuk **SELECT**, **INSERT**, **UPDATE**, dan **DELETE**.
4. Pastikan `Target roles` diatur ke `anon` (atau public) dan expression diatur ke `true`.

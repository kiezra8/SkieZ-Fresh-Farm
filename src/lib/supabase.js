// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Supabase Client
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

// Anon key is the PUBLIC key — safe to include in frontend code.
// Falls back to hardcoded values if .env isn't loaded by Vite.
const SUPABASE_URL = 'https://cqxcbsixzcyhkgwwtdbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeGNic2l4emN5aGtnd3d0ZGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTQ3OTUsImV4cCI6MjA4Nzg5MDc5NX0.pWXL6j4Ak40FtWzPX4dBD6STpKvsyUYI5su8xW-7uHA';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export const missingEnv = false; // always has a key now

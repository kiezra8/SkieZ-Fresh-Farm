// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Supabase Client
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '[Supabase] Missing environment variables.\n' +
        'Create a .env file in your project root with:\n' +
        'VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co\n' +
        'VITE_SUPABASE_ANON_KEY=your-anon-key'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

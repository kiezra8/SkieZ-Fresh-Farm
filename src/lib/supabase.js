// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Supabase Client
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

const missingEnv = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
if (missingEnv) {
    console.warn(
        '[SkieZ] Supabase env vars not found. ' +
        'Make sure .env exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, ' +
        'then restart the dev server (npm run dev).'
    );
}

// createClient is always called with valid strings — never crashes the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export { missingEnv };

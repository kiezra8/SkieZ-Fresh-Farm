// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Authentication Service
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';

/**
 * Sign up a new customer with email & password.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 */
export async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName, role: 'customer' },
        },
    });
    return { data, error };
}

/**
 * Sign in an existing user with email & password.
 * @param {string} email
 * @param {string} password
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

/**
 * Sign in with Google OAuth.
 */
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/account',
        },
    });
    return { data, error };
}

/**
 * Sign the current user out.
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Get the currently authenticated user, or null.
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
}

/**
 * Send a password-reset email.
 * @param {string} email
 */
export async function sendPasswordReset(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/account',
    });
    return { data, error };
}

/**
 * Update the current user's password (after clicking reset link).
 * @param {string} newPassword
 */
export async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
}

/**
 * Update the current user's profile metadata.
 * @param {object} updates   - e.g. { full_name, phone, address }
 */
export async function updateProfile(updates) {
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    return { data, error };
}

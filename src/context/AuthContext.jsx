import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { signIn, signUp, signOut, signInWithGoogle, updateProfile } from '../lib/authService';

// ─────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null); // extra user metadata

    // Boot: restore session from Supabase storage
    useEffect(() => {
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setSession(session);
                setUser(session?.user ?? null);
                setProfile(session?.user?.user_metadata ?? null);
            })
            .catch((err) => {
                console.warn('[AuthContext] getSession failed:', err.message);
            })
            .finally(() => {
                setLoading(false);
            });

        // Listen to auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setProfile(session?.user?.user_metadata ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = useCallback(async (email, password) => {
        const { data, error } = await signIn(email, password);
        return { data, error };
    }, []);

    const register = useCallback(async (email, password, fullName) => {
        const { data, error } = await signUp(email, password, fullName);
        return { data, error };
    }, []);

    const loginWithGoogle = useCallback(async () => {
        const { data, error } = await signInWithGoogle();
        return { data, error };
    }, []);

    const logout = useCallback(async () => {
        await signOut();
    }, []);

    const saveProfile = useCallback(async (updates) => {
        const { data, error } = await updateProfile(updates);
        if (!error) setProfile(prev => ({ ...prev, ...updates }));
        return { data, error };
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user, session, loading, profile,
            isAuthenticated,
            login, register, loginWithGoogle, logout, saveProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};

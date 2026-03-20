// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — In-App Chat Service (Supabase Realtime)
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';

// ── Generate a persistent guest ID stored in localStorage ────────────────────
export function getGuestId() {
    let id = localStorage.getItem('skiezGuestId');
    if (!id) {
        id = 'guest_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
        localStorage.setItem('skiezGuestId', id);
    }
    return id;
}

export function getGuestName() {
    return localStorage.getItem('skiezGuestName') || '';
}

export function setGuestName(name) {
    localStorage.setItem('skiezGuestName', name);
}

// ── Fetch or create a chat session for a user / guest ────────────────────────
export async function getOrCreateSession(userId = null) {
    const guestId = getGuestId();
    const lookupKey = userId || guestId;

    // Try to find existing session
    let query = supabase
        .from('chat_sessions')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(1);

    if (userId) {
        query = query.eq('user_id', userId);
    } else {
        query = query.eq('guest_id', guestId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Session fetch error:', error);
        return { session: null, error };
    }

    if (data && data.length > 0) {
        return { session: data[0], error: null };
    }

    // Create new session
    const guestName = getGuestName() || 'Guest';
    const sessionData = {
        user_id: userId || null,
        guest_id: userId ? null : guestId,
        display_name: guestName,
        last_message_at: new Date().toISOString(),
    };

    const { data: newSession, error: createError } = await supabase
        .from('chat_sessions')
        .insert([sessionData])
        .select()
        .single();

    return { session: newSession, error: createError };
}

// ── Update session display name ────────────────────────────────────────────────
export async function updateSessionName(sessionId, name) {
    return await supabase
        .from('chat_sessions')
        .update({ display_name: name })
        .eq('id', sessionId);
}

// ── Fetch messages for a session ──────────────────────────────────────────────
export async function fetchMessages(sessionId) {
    return await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
}

// ── Send a message ─────────────────────────────────────────────────────────────
export async function sendMessage(sessionId, text, isAdmin = false, senderName = 'You') {
    const msg = {
        session_id: sessionId,
        text: text.trim(),
        is_admin: isAdmin,
        sender_name: isAdmin ? 'SkieZ Farm' : senderName,
        created_at: new Date().toISOString(),
    };

    // Update last_message_at; increment unread counter for the other party
    let rpcError = null;
    if (isAdmin) {
        // Admin sent → increment user_unread, reset admin_unread
        const { error: err } = await supabase.rpc('increment_user_unread', { session_id: sessionId });
        rpcError = err;
    } else {
        // User sent → increment admin_unread, reset user_unread
        const { error: err } = await supabase.rpc('increment_admin_unread', { session_id: sessionId });
        rpcError = err;
    }
    if (rpcError) console.error('Chat RPC error:', rpcError);

    const { error: sessionUpdateError } = await supabase
        .from('chat_sessions')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', sessionId);
    if (sessionUpdateError) console.error('Chat session update error:', sessionUpdateError);

    const result = await supabase
        .from('chat_messages')
        .insert([msg])
        .select()
        .single();
    
    if (result.error) console.error('Chat message insert error:', result.error);
    return result;
}

// ── Mark messages as read ──────────────────────────────────────────────────────
export async function markRead(sessionId, isAdmin = false) {
    const col = isAdmin ? 'admin_unread' : 'user_unread';
    return await supabase
        .from('chat_sessions')
        .update({ [col]: 0 })
        .eq('id', sessionId);
}

// ── Subscribe to new messages in a session ────────────────────────────────────
export function subscribeToMessages(sessionId, onMessage) {
    return supabase
        .channel(`messages:${sessionId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `session_id=eq.${sessionId}`,
        }, (payload) => {
            onMessage(payload.new);
        })
        .subscribe();
}

// ── Admin: subscribe to ALL new messages ──────────────────────────────────────
export function subscribeToAllMessages(onMessage) {
    return supabase
        .channel('all_messages')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
        }, (payload) => {
            onMessage(payload.new);
        })
        .subscribe();
}

// ── Admin: fetch all sessions ──────────────────────────────────────────────────
export async function fetchAllSessions() {
    return await supabase
        .from('chat_sessions')
        .select('*')
        .order('last_message_at', { ascending: false });
}

// ── Admin: subscribe to new/updated sessions ──────────────────────────────────
export function subscribeToSessions(onChange) {
    return supabase
        .channel('chat_sessions_changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'chat_sessions',
        }, (payload) => {
            onChange(payload);
        })
        .subscribe();
}

// ── Play loud notification sound ──────────────────────────────────────────────
export function playNotificationSound(isAdmin = false) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const playBeep = (frequency, startTime, duration, volume = 0.8) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, startTime);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };

        const now = ctx.currentTime;

        if (isAdmin) {
            // Admin gets a louder, 3-tone urgent alarm
            playBeep(880, now, 0.18, 1.0);
            playBeep(1100, now + 0.20, 0.18, 1.0);
            playBeep(1320, now + 0.40, 0.30, 1.0);
        } else {
            // User gets a friendly 2-tone ping
            playBeep(660, now, 0.15, 0.8);
            playBeep(880, now + 0.17, 0.22, 0.8);
        }
    } catch (e) {
        console.warn('Audio notification failed:', e);
    }
}

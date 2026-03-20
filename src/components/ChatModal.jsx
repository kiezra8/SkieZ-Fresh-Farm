import { useState, useEffect, useRef, useCallback } from 'react';
import {
    getOrCreateSession, fetchMessages, sendMessage,
    subscribeToMessages, markRead, updateSessionName,
    getGuestName, setGuestName, getGuestId,
    playNotificationSound,
} from '../lib/chatService';
import { FiX, FiSend, FiMessageCircle, FiChevronDown } from 'react-icons/fi';

function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatModal({ isOpen, onClose, user }) {
    const [stage, setStage] = useState('name'); // 'name' | 'chat'
    const [nameInput, setNameInput] = useState('');
    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [scrolledUp, setScrolledUp] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const channelRef = useRef(null);
    const hasInitRef = useRef(false);

    const scrollToBottom = useCallback((smooth = true) => {
        bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        setScrolledUp(false);
        setUnreadCount(0);
    }, []);

    // ── Init session ───────────────────────────────────────────────────────────
    const initSession = useCallback(async (displayName) => {
        setLoading(true);
        const { session: s, error } = await getOrCreateSession(user?.id || null);
        if (error || !s) { setLoading(false); return; }

        if (displayName) {
            await updateSessionName(s.id, displayName);
            setGuestName(displayName);
        }

        setSession(s);

        // Load existing messages
        const { data: msgs } = await fetchMessages(s.id);
        setMessages(msgs || []);
        await markRead(s.id, false);
        setLoading(false);

        setTimeout(() => scrollToBottom(false), 100);

        // Subscribe to new messages
        if (channelRef.current) channelRef.current.unsubscribe();
        channelRef.current = subscribeToMessages(s.id, (newMsg) => {
            setMessages(prev => {
                const exists = prev.find(m => m.id === newMsg.id);
                if (exists) return prev;
                if (newMsg.is_admin) {
                    playNotificationSound(false);
                }
                return [...prev, newMsg];
            });

            setScrolledUp(sv => {
                if (!sv) {
                    setTimeout(() => scrollToBottom(), 50);
                } else {
                    if (newMsg.is_admin) setUnreadCount(c => c + 1);
                }
                return sv;
            });
        });
    }, [user, scrollToBottom]);

    // When modal opens
    useEffect(() => {
        if (isOpen && !hasInitRef.current) {
            hasInitRef.current = true;
            const savedName = user?.user_metadata?.full_name || user?.email || getGuestName();
            if (savedName) {
                setNameInput(savedName);
                setStage('chat');
                initSession(savedName);
            } else {
                setStage('name');
                setLoading(false);
            }
        }
    }, [isOpen, user, initSession]);

    // Clean up on close
    useEffect(() => {
        if (!isOpen) {
            hasInitRef.current = false;
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current = null;
            }
        }
    }, [isOpen]);

    // Auto scroll when new messages arrive and we're at bottom
    useEffect(() => {
        if (messages.length > 0 && !scrolledUp) {
            setTimeout(() => scrollToBottom(false), 50);
        }
    }, [messages, scrolledUp, scrollToBottom]);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        setScrolledUp(!atBottom);
        if (atBottom) {
            setUnreadCount(0);
            markRead(session?.id, false);
        }
    };

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        const name = nameInput.trim();
        if (!name) return;
        setStage('chat');
        setLoading(true);
        await initSession(name);
        setTimeout(() => inputRef.current?.focus(), 200);
    };

    const handleSend = async () => {
        if (!text.trim() || !session || sending) return;
        const msg = text.trim();
        setText('');
        setSending(true);

        const displayName = user?.user_metadata?.full_name || user?.email || getGuestName() || nameInput || 'Guest';
        const { data: sent, error } = await sendMessage(session.id, msg, false, displayName);
        setSending(false);

        if (error) {
            console.error('Send error:', error);
            alert('Failed to send message. Please make sure the SQL was applied in Supabase and Realtime is enabled.');
            setText(msg); // restore text so user doesn't lose it
            return;
        }

        if (sent) {
            setMessages(prev => {
                const exists = prev.find(m => m.id === sent.id);
                return exists ? prev : [...prev, sent];
            });
            setTimeout(() => scrollToBottom(), 50);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-overlay" onClick={onClose}>
            <div className="chat-panel" onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="chat-header-panel">
                    <div className="chat-header-avatar">🌿</div>
                    <div className="chat-header-info">
                        <div className="chat-header-name">SkieZ Fresh Farm</div>
                        <div className="chat-header-status">
                            <span className="chat-online-dot" /> Online · replies instantly
                        </div>
                    </div>
                    <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
                        <FiX />
                    </button>
                </div>

                {/* ── Name collection stage ── */}
                {stage === 'name' && (
                    <div className="chat-name-stage">
                        <div className="chat-name-icon"><FiMessageCircle /></div>
                        <h3 className="chat-name-title">Start a Conversation</h3>
                        <p className="chat-name-sub">
                            Chat with us about orders, products, or delivery — no account needed!
                        </p>
                        <form onSubmit={handleNameSubmit} className="chat-name-form">
                            <input
                                type="text"
                                placeholder="Your name (e.g. John)"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                className="chat-name-input"
                                maxLength={40}
                                autoFocus
                            />
                            <button type="submit" className="chat-name-submit" disabled={!nameInput.trim()}>
                                Start Chatting →
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Messages stage ── */}
                {stage === 'chat' && (
                    <>
                        <div className="chat-messages-area" ref={scrollRef} onScroll={handleScroll}>
                            {loading && (
                                <div className="chat-loading">
                                    <div className="chat-spinner" />
                                </div>
                            )}

                            {!loading && messages.length === 0 && (
                                <div className="chat-empty-msg">
                                    <div className="chat-empty-icon">💬</div>
                                    <p>Send us a message! We're happy to help with orders, availability, or anything else.</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => {
                                const isMe = !msg.is_admin;
                                const showName = idx === 0 || messages[idx - 1]?.is_admin !== msg.is_admin;
                                return (
                                    <div key={msg.id} className={`chat-message-row ${isMe ? 'me' : 'them'}`}>
                                        {!isMe && showName && (
                                            <div className="chat-msg-avatar">🌿</div>
                                        )}
                                        {!isMe && !showName && <div className="chat-msg-avatar-spacer" />}
                                        <div className="chat-bubble-wrap">
                                            <div className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}>
                                                {msg.text}
                                            </div>
                                            <div className="chat-msg-time">{formatTime(msg.created_at)}</div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div ref={bottomRef} />
                        </div>

                        {/* Scroll-to-bottom pill */}
                        {scrolledUp && (
                            <button className="chat-scroll-pill" onClick={() => scrollToBottom()}>
                                {unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : '↓'}
                                <FiChevronDown />
                            </button>
                        )}

                        {/* ── Input bar ── */}
                        <div className="chat-input-bar">
                            <textarea
                                ref={inputRef}
                                className="chat-input"
                                placeholder="Type a message..."
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                maxLength={1000}
                            />
                            <button
                                className="chat-send-btn"
                                onClick={handleSend}
                                disabled={!text.trim() || sending}
                                aria-label="Send message"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

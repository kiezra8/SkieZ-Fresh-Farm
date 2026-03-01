import { useState } from 'react';
import {
    FiUser, FiShoppingBag, FiMapPin, FiHeart,
    FiMessageCircle, FiStar, FiGift, FiLogOut,
    FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import { sendPasswordReset, signInWithGoogle } from '../lib/authService';
import { supabase } from '../lib/supabase';

const MODE = { SIGNIN: 'signin', SIGNUP: 'signup', PHONE: 'phone', RESET: 'reset' };

export default function AccountPage({ onChatOpen }) {
    const { user, isAuthenticated, loading, login, register, logout } = useAuth();

    // Auth panel open/close (collapsed by default for guests)
    const [authOpen, setAuthOpen] = useState(false);
    const [mode, setMode] = useState(MODE.SIGNIN);

    // Form state
    const [showPw, setShowPw] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const clear = () => { setError(''); setSuccess(''); };

    // ── Friendly network error parser ─────────────────────────────────────────
    const parseErr = (err) => {
        if (!err) return '';
        const msg = err.message || '';
        if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
            return 'Cannot reach Supabase — your project is likely PAUSED.\n\nFix: Go to supabase.com → open your project → click "Restore project" → wait 60 seconds → try again.';
        }
        if (msg.includes('Invalid login')) return 'Wrong email or password.';
        if (msg.includes('Email not confirmed')) return 'Please confirm your email — check your inbox.';
        if (msg.includes('User already registered')) return 'Email already registered. Try signing in instead.';
        return msg || 'Something went wrong. Please try again.';
    };

    // ── Test connection ───────────────────────────────────────────────────────
    const [testing, setTesting] = useState(false);
    const testConnection = async () => {
        setTesting(true); clear();
        try {
            const res = await fetch('https://cqxcbsixzcyhkgwwtdbd.supabase.co/rest/v1/', {
                headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '' }
            });
            if (res.ok || res.status === 400 || res.status === 404) {
                setSuccess('✅ Supabase is reachable! If login still fails, check your email and password.');
            } else if (res.status === 503) {
                setError('Project is PAUSED (503).\nGo to supabase.com → your project → "Restore project".');
            } else {
                setError(`Server replied ${res.status}. Check your Supabase dashboard.`);
            }
        } catch {
            setError('Cannot connect to Supabase at all.\n\nCheck:\n1. Your internet is working\n2. Project is not paused at supabase.com\n3. Dev server restarted after .env change (Ctrl+C → npm run dev)');
        } finally { setTesting(false); }
    };

    // ── Email sign in ─────────────────────────────────────────────────────────
    const handleSignIn = async (e) => {
        e.preventDefault(); clear();
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        setAuthLoading(true);
        const { error: err } = await login(email.trim(), password);
        setAuthLoading(false);
        if (err) setError(parseErr(err));
        else setAuthOpen(false);
    };

    // ── Email sign up ─────────────────────────────────────────────────────────
    const handleSignUp = async (e) => {
        e.preventDefault(); clear();
        if (!fullName || !email || !password) { setError('Please fill in all fields.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setAuthLoading(true);
        const { error: err } = await register(email.trim(), password, fullName.trim());
        setAuthLoading(false);
        if (err) setError(parseErr(err));
        else setSuccess('Account created! Check your email to confirm, then sign in.');
    };

    // ── Google ────────────────────────────────────────────────────────────────
    const handleGoogle = async () => {
        clear();
        const { error: err } = await signInWithGoogle();
        if (err) setError(parseErr(err));
    };


    // ── Phone OTP ─────────────────────────────────────────────────────────────
    const handleSendOTP = async (e) => {
        e.preventDefault(); clear();
        if (!phone) { setError('Enter your phone number.'); return; }
        const formatted = phone.startsWith('+') ? phone : `+256${phone.replace(/^0/, '')}`;
        setAuthLoading(true);
        const { error: err } = await supabase.auth.signInWithOtp({ phone: formatted });
        setAuthLoading(false);
        if (err) setError(err.message || 'Could not send OTP.');
        else { setOtpSent(true); setSuccess(`OTP sent to ${formatted}`); }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault(); clear();
        if (!otp) { setError('Enter the OTP code.'); return; }
        const formatted = phone.startsWith('+') ? phone : `+256${phone.replace(/^0/, '')}`;
        setAuthLoading(true);
        const { error: err } = await supabase.auth.verifyOtp({ phone: formatted, token: otp, type: 'sms' });
        setAuthLoading(false);
        if (err) setError(err.message || 'Invalid OTP code.');
        else setAuthOpen(false);
    };

    // ── Password reset ────────────────────────────────────────────────────────
    const handleReset = async (e) => {
        e.preventDefault(); clear();
        if (!email) { setError('Enter your email address.'); return; }
        setAuthLoading(true);
        const { error: err } = await sendPasswordReset(email.trim());
        setAuthLoading(false);
        if (err) setError(err.message || 'Could not send reset email.');
        else setSuccess('Reset link sent! Check your inbox.');
    };

    // ── Account options (shown to everyone) ───────────────────────────────────
    const options = [
        { icon: <FiShoppingBag />, label: 'My Orders', desc: 'Track and view your past orders' },
        { icon: <FiHeart />, label: 'Saved Items', desc: "Products you've added to wishlist" },
        { icon: <FiMapPin />, label: 'Delivery Addresses', desc: 'Manage your delivery locations' },
        { icon: <FiStar />, label: 'My Reviews', desc: "Products you've reviewed" },
        { icon: <FiGift />, label: 'Offers & Vouchers', desc: 'Your available promo codes' },
        { icon: <FiMessageCircle />, label: 'Contact Support', desc: 'Chat or call us on 0702 370 441', action: 'chat' },
    ];

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="page">
            <div className="page-header">
                <h1>My Account</h1>
                <p>{isAuthenticated ? `Signed in as ${user.email || user.phone}` : 'Browse freely — sign in for order tracking'}</p>
            </div>

            <div className="account-page">

                {/* ── AUTH SECTION ── */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                        <div style={st.spinner} />
                    </div>
                ) : isAuthenticated ? (
                    /* ── Signed-in profile card ── */
                    <div style={st.profileCard}>
                        <div style={st.avatar}>
                            {(user.user_metadata?.full_name || user.email || 'U')[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={st.profileName}>
                                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'}
                            </div>
                            <div style={st.profileEmail}>{user.email || user.phone}</div>
                        </div>
                        <button onClick={logout} style={st.signOutBtn}>
                            <FiLogOut size={13} /> Sign Out
                        </button>
                    </div>
                ) : (
                    /* ── Collapsible sign-in panel ── */
                    <div style={st.authPanel}>
                        <button
                            onClick={() => { setAuthOpen(v => !v); clear(); }}
                            style={st.authToggle}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiUser size={16} /> Sign in / Create Account
                            </span>
                            {authOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {authOpen && (
                            <div style={st.authBody}>
                                {/* Mode tabs */}
                                <div style={st.modeTabs}>
                                    {[
                                        { key: MODE.SIGNIN, label: 'Sign In' },
                                        { key: MODE.SIGNUP, label: 'Sign Up' },
                                        { key: MODE.PHONE, label: '📱 Phone' },
                                    ].map(m => (
                                        <button key={m.key}
                                            onClick={() => { setMode(m.key); clear(); setOtpSent(false); }}
                                            style={{ ...st.modeTab, ...(mode === m.key ? st.modeTabActive : {}) }}>
                                            {m.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Alerts */}
                                {error && (
                                    <div style={st.errorBox}>
                                        <span style={{ whiteSpace: 'pre-line' }}>⚠️ {error}</span>
                                    </div>
                                )}
                                {success && <div style={st.successBox}>{success}</div>}

                                {/* Test Connection button — always shown at top */}
                                <button onClick={testConnection} disabled={testing} style={st.testBtn}>
                                    {testing ? '🔄 Testing…' : '🔌 Test Supabase Connection'}
                                </button>


                                {/* ── Sign In ── */}
                                {mode === MODE.SIGNIN && (
                                    <form onSubmit={handleSignIn} style={st.form}>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}><FiMail size={12} /> Email</label>
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                                placeholder="your@email.com" autoComplete="email"
                                                style={st.input} required />
                                        </div>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}><FiLock size={12} /> Password</label>
                                            <div style={st.pwWrap}>
                                                <input type={showPw ? 'text' : 'password'} value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    placeholder="Your password" autoComplete="current-password"
                                                    style={{ ...st.input, paddingRight: 44 }} required />
                                                <button type="button" onClick={() => setShowPw(v => !v)} style={st.eyeBtn}>
                                                    {showPw ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={authLoading} style={st.submitBtn}>
                                            {authLoading ? 'Signing in…' : 'Sign In'}
                                        </button>
                                        <button type="button"
                                            onClick={() => { setMode(MODE.RESET); clear(); }}
                                            style={st.linkBtn}>Forgot password?
                                        </button>
                                    </form>
                                )}

                                {/* ── Sign Up ── */}
                                {mode === MODE.SIGNUP && (
                                    <form onSubmit={handleSignUp} style={st.form}>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}><FiUser size={12} /> Full Name</label>
                                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                                                placeholder="Your full name" style={st.input} required />
                                        </div>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}><FiMail size={12} /> Email</label>
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                                placeholder="your@email.com" autoComplete="email"
                                                style={st.input} required />
                                        </div>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}><FiLock size={12} /> Password</label>
                                            <div style={st.pwWrap}>
                                                <input type={showPw ? 'text' : 'password'} value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    placeholder="Min 6 characters"
                                                    style={{ ...st.input, paddingRight: 44 }} required />
                                                <button type="button" onClick={() => setShowPw(v => !v)} style={st.eyeBtn}>
                                                    {showPw ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={authLoading} style={st.submitBtn}>
                                            {authLoading ? 'Creating account…' : 'Create Account'}
                                        </button>
                                    </form>
                                )}

                                {/* ── Phone ── */}
                                {mode === MODE.PHONE && !otpSent && (
                                    <form onSubmit={handleSendOTP} style={st.form}>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}><FiPhone size={12} /> Phone Number</label>
                                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                                placeholder="0700 000 000 or +256…" style={st.input} required />
                                            <div style={st.hint}>Uganda numbers auto-formatted (+256)</div>
                                        </div>
                                        <button type="submit" disabled={authLoading} style={st.submitBtn}>
                                            {authLoading ? 'Sending OTP…' : '📲 Send OTP Code'}
                                        </button>
                                    </form>
                                )}
                                {mode === MODE.PHONE && otpSent && (
                                    <form onSubmit={handleVerifyOTP} style={st.form}>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}>Enter OTP Code</label>
                                            <input type="text" inputMode="numeric" maxLength={6} value={otp}
                                                onChange={e => setOtp(e.target.value)}
                                                placeholder="6-digit code"
                                                style={{ ...st.input, textAlign: 'center', fontSize: 20, letterSpacing: 6 }} required />
                                        </div>
                                        <button type="submit" disabled={authLoading} style={st.submitBtn}>
                                            {authLoading ? 'Verifying…' : '✅ Verify Code'}
                                        </button>
                                        <button type="button" onClick={() => { setOtpSent(false); clear(); }} style={st.linkBtn}>
                                            ← Try another number
                                        </button>
                                    </form>
                                )}

                                {/* ── Reset ── */}
                                {mode === MODE.RESET && (
                                    <form onSubmit={handleReset} style={st.form}>
                                        <div style={st.fieldWrap}>
                                            <label style={st.label}><FiMail size={12} /> Email</label>
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                                placeholder="your@email.com" style={st.input} required />
                                        </div>
                                        <button type="submit" disabled={authLoading} style={st.submitBtn}>
                                            {authLoading ? 'Sending…' : '📧 Send Reset Link'}
                                        </button>
                                        <button type="button" onClick={() => { setMode(MODE.SIGNIN); clear(); }} style={st.linkBtn}>
                                            ← Back to sign in
                                        </button>
                                    </form>
                                )}

                                {/* ── Google ── */}
                                {(mode === MODE.SIGNIN || mode === MODE.SIGNUP) && (
                                    <>
                                        <div style={st.divider}><span style={st.divLine} /><span>or</span><span style={st.divLine} /></div>
                                        <button onClick={handleGoogle} style={st.googleBtn}>
                                            <FcGoogle size={18} /> Continue with Google
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Referral banner (everyone sees this) ── */}
                <div style={{ background: 'linear-gradient(135deg,#e63946,#c1121f)', borderRadius: 14, padding: '18px 20px', color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                    <span style={{ fontSize: 40 }}>🎁</span>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3 }}>Refer a Friend & Earn!</div>
                        <div style={{ fontSize: 13, opacity: .85 }}>
                            Share our number <strong>+256 702 370 441</strong> — you both get UGX 5,000 off your next order.
                        </div>
                    </div>
                </div>

                {/* ── Account options (everyone sees these) ── */}
                <div className="account-options">
                    {options.map((opt, i) => (
                        <button key={i} className="account-option-btn"
                            onClick={opt.action === 'chat' ? onChatOpen : undefined}>
                            {opt.icon}
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                                <div style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>{opt.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: 24, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
                    📞 Need help? Call or WhatsApp <strong style={{ color: '#e63946' }}>+256 702 370 441</strong>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
const st = {
    // Auth panel
    authPanel: { marginBottom: 20 },
    authToggle: {
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px', background: '#fff', border: '1.5px solid #e8e8e8',
        borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#1a1a2e',
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
    },
    authBody: { background: '#fafafa', border: '1.5px solid #e8e8e8', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 16 },

    modeTabs: { display: 'flex', background: '#f0f0f0', borderRadius: 10, padding: 3, marginBottom: 16 },
    modeTab: { flex: 1, padding: '8px 4px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, color: '#666', cursor: 'pointer', fontFamily: 'inherit' },
    modeTabActive: { background: '#fff', color: '#e63946', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,.1)' },

    form: { display: 'flex', flexDirection: 'column', gap: 2 },
    fieldWrap: { marginBottom: 10 },
    label: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.3 },
    input: {
        width: '100%', boxSizing: 'border-box', padding: '11px 13px',
        border: '1.5px solid #e8e8e8', borderRadius: 9, fontSize: 14,
        color: '#1a1a2e', outline: 'none', fontFamily: 'inherit',
        transition: 'border-color .2s', background: '#fff',
    },
    hint: { fontSize: 11, color: '#999', marginTop: 3 },
    pwWrap: { position: 'relative' },
    eyeBtn: { position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    submitBtn: {
        width: '100%', padding: '12px', background: '#e63946', border: 'none',
        borderRadius: 9, color: '#fff', fontWeight: 700, fontSize: 14,
        cursor: 'pointer', fontFamily: 'inherit', marginTop: 6,
        boxShadow: '0 2px 10px rgba(230,57,70,.25)',
    },
    linkBtn: { background: 'none', border: 'none', color: '#e63946', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0', textDecoration: 'underline' },

    divider: { display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 10px', fontSize: 12, color: '#bbb' },
    divLine: { flex: 1, height: 1, background: '#e8e8e8' },
    googleBtn: {
        width: '100%', padding: '11px', background: '#fff', border: '1.5px solid #e0e0e0',
        borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
    },

    errorBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '9px 13px', color: '#dc2626', fontSize: 12, marginBottom: 10 },
    successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '9px 13px', color: '#16a34a', fontSize: 12, marginBottom: 10 },
    testBtn: { width: '100%', padding: '9px', background: '#f0f9ff', border: '1px dashed #93c5fd', borderRadius: 8, color: '#1d4ed8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 },

    // Profile card (signed in)
    profileCard: { display: 'flex', alignItems: 'center', gap: 12, background: '#f8f8f8', borderRadius: 14, padding: '12px 14px', marginBottom: 20, border: '1px solid #eee' },
    avatar: { width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#e63946,#c1121f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0 },
    profileName: { fontWeight: 700, fontSize: 15, color: '#1a1a2e' },
    profileEmail: { fontSize: 12, color: '#999', marginTop: 1 },
    signOutBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'transparent', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#666', flexShrink: 0 },

    spinner: { width: 28, height: 28, border: '3px solid #eee', borderTop: '3px solid #e63946', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};

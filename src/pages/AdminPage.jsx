import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    adminFetchAllProducts, adminUpdateProduct,
    adminAddProduct, adminDeleteProduct,
    uploadProductImage, adminFetchStats,
    adminFetchAllOrders, adminUpdateOrderStatus, adminAddOrder
} from '../lib/adminService';
import {
    addFinanceRecord, deleteFinanceRecord,
    fetchFinanceRecords, fetchFinanceStats,
    fetchDailyRevenue, fetchWeeklyRevenue,
    fetchMonthlyRevenue, fetchTopProducts,
} from '../lib/financeService';

const ADMIN_EMAIL = 'israelezrakisakye@gmail.com';

const CATEGORY_SLUGS = [
    'vegetables', 'fruits', 'grains', 'oils', 'legumes', 'flours', 'spices', 'dairy', 'pasta', 'sugar'
];
const CATEGORY_LABELS = {
    vegetables: 'Vegetables', fruits: 'Fruits', grains: 'Rice & Grains', oils: 'Cooking Oils',
    legumes: 'Legumes', flours: 'Flours', spices: 'Spices', dairy: 'Dairy & Eggs',
    pasta: 'Pasta', sugar: 'Sugar',
};
const STATUS_COLORS = {
    pending: '#f59e0b', confirmed: '#3b82f6', preparing: '#8b5cf6',
    dispatched: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};
const STATUS_NEXT = {
    pending: 'confirmed', confirmed: 'preparing', preparing: 'dispatched',
    dispatched: 'delivered', delivered: 'delivered', cancelled: 'cancelled',
};
const fmt = (n) => `UGX ${Number(n).toLocaleString()}`;
const BLANK = {
    name: '', category: 'vegetables', unit: 'Per 1 kg', price: '', original_price: '',
    discount: '0', rating: '5.0', reviews: '0', image: '', description: '', stock: '0', badge: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState(ADMIN_EMAIL);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Enter your email and password.'); return; }
        setLoading(true);
        const { error: err } = await onLogin(email.trim().toLowerCase(), password);
        setLoading(false);
        if (err) {
            const msg = err.message || '';
            if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network'))
                setError('Cannot connect to server. Check your internet and try again.');
            else if (msg.includes('Invalid login') || msg.includes('invalid_credentials'))
                setError('Wrong password. Make sure you signed up with this email first.');
            else if (msg.includes('Email not confirmed'))
                setError('Check your email inbox and click the confirmation link first.');
            else if (msg.includes('User not found'))
                setError('No account found. Go to /account and sign up first.');
            else
                setError(msg || 'Sign in failed.');
        }
    };

    return (
        <div style={ls.root}>
            <div style={ls.blob1} />
            <div style={ls.blob2} />

            <div style={ls.card}>
                {/* Logo */}
                <div style={ls.logo}>
                    <svg width="52" height="52" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1a7a3c" />
                                <stop offset="100%" stopColor="#0d4a22" />
                            </linearGradient>
                        </defs>
                        <rect width="512" height="512" rx="100" fill="url(#bg2)" />
                        <path d="M160 280 L352 280 L330 370 Q326 390 306 390 L206 390 Q186 390 182 370 Z" fill="none" stroke="white" strokeWidth="22" strokeLinejoin="round" />
                        <path d="M200 280 Q200 210 256 210 Q312 210 312 280" fill="none" stroke="white" strokeWidth="22" strokeLinecap="round" />
                        <line x1="256" y1="180" x2="256" y2="130" stroke="white" strokeWidth="14" strokeLinecap="round" />
                        <path d="M256 130 Q230 100 215 75 Q240 68 260 90 Q290 68 300 85 Q278 100 256 130 Z" fill="white" />
                        <circle cx="340" cy="175" r="18" fill="#f4a261" />
                    </svg>
                </div>
                <div style={ls.appName}>SkieZ Fresh Farm</div>
                <div style={ls.subtitle}>Admin Panel</div>

                {/* "Already signed in elsewhere" tip */}
                <div style={ls.infoBox}>
                    💡 If you already signed in at <strong>/account</strong> with the admin email, just go back and visit <strong>/admin</strong> again — you'll be admitted automatically.
                </div>

                <form onSubmit={handleSubmit} style={ls.form}>
                    <div style={ls.fieldWrap}>
                        <label style={ls.label}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            autoComplete="email"
                            style={ls.input}
                            required
                        />
                    </div>

                    <div style={ls.fieldWrap}>
                        <label style={ls.label}>Password</label>
                        <div style={ls.pwWrap}>
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                style={{ ...ls.input, paddingRight: 46 }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(v => !v)}
                                style={ls.eyeBtn}
                                tabIndex={-1}
                            >
                                {showPw ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={ls.errorBox}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...ls.submitBtn, opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <span style={ls.spinnerSmall} /> Signing in...
                            </span>
                        ) : '🔐 Sign In to Admin'}
                    </button>
                </form>

                <p style={ls.hint}>
                    Only accessible to authorised administrators.
                </p>

                <a href="/" style={ls.backLink}>← Back to shop</a>
            </div>
        </div>
    );
}


// ─────────────────────────────────────────────────────────────────────────────
// ── MAIN ADMIN DASHBOARD ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
    const { user, loading: authLoading, login, logout } = useAuth();

    // Case-insensitive match so capitalisation differences don't block access
    const isAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

    // ── Data state ─────────────────────────────────────────────────────────────
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [filterCat, setFilterCat] = useState('all');
    const [search, setSearch] = useState('');
    const [dataLoading, setDataLoading] = useState(true);

    // Edit drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState(BLANK);
    const [imgPreview, setImgPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const fileInputRef = useRef();

    // ── Orders state ──────────────────────────────────────────────────────────
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderForm, setOrderForm] = useState({
        delivery_name: '', delivery_phone: '', delivery_address: '',
        total_amount: '', items_desc: '', status: 'delivered', created_at: new Date().toISOString().split('T')[0]
    });
    const [orderSaving, setOrderSaving] = useState(false);

    // ── Finance state ──────────────────────────────────────────────────────────
    const [finStats, setFinStats] = useState({});
    const [finRecords, setFinRecords] = useState([]);
    const [chartMode, setChartMode] = useState('daily');
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [finLoading, setFinLoading] = useState(false);
    const [finForm, setFinForm] = useState({
        record_date: new Date().toISOString().split('T')[0],
        product_name: '', category: 'vegetables', quantity: '1',
        unit_price: '', payment_method: 'cash', notes: '',
    });
    const [finSaving, setFinSaving] = useState(false);
    const [showFinForm, setShowFinForm] = useState(false);

    // ── Load data ──────────────────────────────────────────────────────────────
    const loadAll = useCallback(async () => {
        setDataLoading(true);
        try {
            const [pRes, oRes, sRes] = await Promise.all([
                adminFetchAllProducts(),
                adminFetchAllOrders(),
                adminFetchStats(),
            ]);
            if (pRes.data) setProducts(pRes.data);
            if (oRes.data) setOrders(oRes.data);
            setStats(sRes);
        } catch (e) {
            console.error('Admin load error:', e);
        } finally {
            setDataLoading(false);
        }
    }, []);

    // ── Load finance data ──────────────────────────────────────────────────────
    const loadFinance = useCallback(async () => {
        setFinLoading(true);
        try {
            const [sRes, rRes, topRes] = await Promise.all([
                fetchFinanceStats(),
                fetchFinanceRecords({ days: 90 }),
                fetchTopProducts(8),
            ]);
            setFinStats(sRes);
            if (rRes.data) setFinRecords(rRes.data);
            if (topRes.data) setTopProducts(topRes.data);
        } catch (e) { console.error('Finance load error:', e); }
        finally { setFinLoading(false); }
    }, []);

    const loadChart = useCallback(async (mode) => {
        let res;
        if (mode === 'daily') res = await fetchDailyRevenue(30);
        else if (mode === 'weekly') res = await fetchWeeklyRevenue(12);
        else res = await fetchMonthlyRevenue(12);
        if (res?.data) setChartData(res.data);
    }, []);

    useEffect(() => { if (isAdmin) loadFinance(); }, [isAdmin, loadFinance]);
    useEffect(() => { if (isAdmin && tab === 'finance') loadChart(chartMode); }, [isAdmin, tab, chartMode, loadChart]);

    useEffect(() => {
        if (isAdmin) loadAll();
    }, [isAdmin, loadAll]);

    // ── Toast ─────────────────────────────────────────────────────────────────
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Drawer helpers ────────────────────────────────────────────────────────
    const openNew = () => {
        setEditProduct(null); setForm(BLANK); setImgPreview(''); setDrawerOpen(true);
    };
    const openEdit = (p) => {
        setEditProduct(p);
        setForm({
            name: p.name, category: p.category, unit: p.unit,
            price: p.price, original_price: p.original_price ?? '',
            discount: p.discount ?? 0, rating: p.rating ?? 5.0,
            reviews: p.reviews ?? 0, image: p.image ?? '',
            description: p.description ?? '', stock: p.stock ?? 0,
            badge: p.badge ?? '',
        });
        setImgPreview(p.image ?? '');
        setDrawerOpen(true);
    };
    const closeDrawer = () => { setDrawerOpen(false); setEditProduct(null); };
    const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

    // ── Image upload ──────────────────────────────────────────────────────────
    const handleImageFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImgPreview(URL.createObjectURL(file));
        setUploading(true);
        const productId = editProduct?.id ?? `new_${Date.now()}`;
        const { url, error } = await uploadProductImage(file, productId);
        setUploading(false);
        if (error) { showToast('Upload failed: ' + error.message, 'error'); return; }
        setField('image', url); setImgPreview(url);
        showToast('Image uploaded ✓');
    };

    // ── Save product ──────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.name.trim() || !form.price) {
            showToast('Name and price are required', 'error'); return;
        }
        setSaving(true);
        const payload = {
            name: form.name.trim(), category: form.category,
            unit: form.unit.trim(), price: Number(form.price),
            original_price: form.original_price ? Number(form.original_price) : null,
            discount: Number(form.discount) || 0,
            rating: parseFloat(form.rating) || 5.0,
            reviews: Number(form.reviews) || 0,
            image: form.image, description: form.description.trim(),
            stock: Number(form.stock) || 0, badge: form.badge.trim(),
        };
        let error;
        if (editProduct) {
            const res = await adminUpdateProduct(editProduct.id, payload);
            error = res.error;
            if (!error) setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, ...payload } : p));
        } else {
            const res = await adminAddProduct(payload);
            error = res.error;
            if (!error && res.data) setProducts(ps => [...ps, res.data]);
        }
        setSaving(false);
        if (error) { showToast('Save failed: ' + error.message, 'error'); }
        else { showToast(editProduct ? 'Product updated ✓' : 'Product added ✓'); closeDrawer(); }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const { error } = await adminDeleteProduct(id);
        if (error) { showToast('Delete failed', 'error'); }
        else { setProducts(ps => ps.filter(p => p.id !== id)); showToast('Product deleted'); closeDrawer(); }
        setConfirmDelete(null);
    };

    // ── Order status ──────────────────────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        const { error } = await adminUpdateOrderStatus(orderId, newStatus);
        if (!error) setOrders(os => os.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        else showToast('Update failed', 'error');
    };

    // ── Filtered products ─────────────────────────────────────────────────────
    const filtered = products.filter(p => {
        const inCat = filterCat === 'all' || p.category === filterCat;
        const q = search.toLowerCase();
        const inSearch = !q || p.name.toLowerCase().includes(q) || (p.badge || '').toLowerCase().includes(q);
        return inCat && inSearch;
    });

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER: Loading spinner while auth resolves
    if (authLoading) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' }}>
                <div style={ds.spinner} />
            </div>
        );
    }

    // RENDER: Signed in but not the admin account
    if (user && !isAdmin) {
        return (
            <div style={{ minHeight: '100dvh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ background: '#1a1d27', borderRadius: 20, padding: '32px 24px', maxWidth: 380, width: '100%', textAlign: 'center', border: '1px solid #2a2d3a' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Not the admin account</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>You are signed in as:</div>
                    <div style={{ fontSize: 14, color: '#f59e0b', fontWeight: 600, marginBottom: 20, wordBreak: 'break-all' }}>{user.email}</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Admin access requires:<br /><strong style={{ color: '#10b981' }}>{ADMIN_EMAIL}</strong></div>
                    <button onClick={logout} style={{ width: '100%', padding: '12px', background: '#10b981', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>
                        Sign out &amp; use admin account
                    </button>
                    <a href="/" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Back to shop</a>
                </div>
            </div>
        );
    }

    // RENDER: Not signed in → show login
    if (!user) {
        return <AdminLogin onLogin={login} />;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER: Full Admin Dashboard
    return (
        <div style={ds.root}>
            {/* Top Bar */}
            <div style={ds.topBar}>
                <div style={ds.topLeft}>
                    <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 6 }}>
                        <rect width="512" height="512" fill="#1a7a3c" />
                        <path d="M160 280 L352 280 L330 370 Q326 390 306 390 L206 390 Q186 390 182 370 Z" fill="none" stroke="white" strokeWidth="28" strokeLinejoin="round" />
                        <path d="M200 280 Q200 210 256 210 Q312 210 312 280" fill="none" stroke="white" strokeWidth="28" strokeLinecap="round" />
                        <path d="M256 130 Q230 100 215 75 Q240 68 260 90 Q290 68 300 85 Q278 100 256 130 Z" fill="white" />
                        <circle cx="340" cy="175" r="18" fill="#f4a261" />
                    </svg>
                    <div>
                        <div style={ds.topTitle}>Admin Panel</div>
                        <div style={ds.topSub}>{user.email}</div>
                    </div>
                </div>
                <button onClick={logout} style={ds.logoutBtn}>Sign Out</button>
            </div>

            {/* Stats Bar */}
            <div style={ds.statsBar}>
                {[
                    { label: 'Products', value: stats.productCount ?? '—', icon: '🥦' },
                    { label: 'Orders', value: stats.orderCount ?? '—', icon: '📦' },
                    { label: 'Pending', value: stats.pendingCount ?? '—', icon: '⏳' },
                ].map(s => (
                    <div key={s.label} style={ds.statCard}>
                        <div style={ds.statIcon}>{s.icon}</div>
                        <div style={ds.statVal}>{s.value}</div>
                        <div style={ds.statLabel}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tab Bar */}
            <div style={ds.tabBar}>
                {[
                    { key: 'products', label: '🥦 Products' },
                    { key: 'orders', label: '📦 Orders' },
                    { key: 'finance', label: '💰 Finance' },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        style={{ ...ds.tabBtn, ...(tab === t.key ? ds.tabActive : {}) }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ═══ PRODUCTS TAB ═══ */}
            {tab === 'products' && (
                <div style={ds.tabContent}>
                    <input
                        placeholder="🔍  Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={ds.searchInput}
                    />
                    {/* Category chips */}
                    <div style={ds.chips}>
                        {['all', ...CATEGORY_SLUGS].map(slug => (
                            <button key={slug} onClick={() => setFilterCat(slug)}
                                style={{ ...ds.chip, ...(filterCat === slug ? ds.chipActive : {}) }}>
                                {slug === 'all' ? 'All' : CATEGORY_LABELS[slug]}
                            </button>
                        ))}
                    </div>
                    <div style={ds.countRow}>
                        <span style={ds.countText}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
                        <button onClick={loadAll} style={ds.refreshBtn}>↻ Refresh</button>
                    </div>
                    {dataLoading ? (
                        <div style={ds.center}><div style={ds.spinner} /></div>
                    ) : (
                        <div style={ds.productList}>
                            {filtered.map(p => (
                                <div key={p.id} style={ds.productRow} onClick={() => openEdit(p)}>
                                    <img
                                        src={p.image || 'https://via.placeholder.com/56'}
                                        alt={p.name}
                                        style={ds.productThumb}
                                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/56'; }}
                                    />
                                    <div style={ds.productInfo}>
                                        <div style={ds.productName}>{p.name}</div>
                                        <div style={ds.productMeta}>
                                            <span style={ds.catChip}>{CATEGORY_LABELS[p.category] || p.category}</span>
                                            <span style={ds.priceText}>{fmt(p.price)}</span>
                                        </div>
                                        <div style={ds.stockRow}>
                                            <span style={{ color: p.stock > 10 ? '#10b981' : '#ef4444', fontSize: 12 }}>
                                                {p.stock > 0 ? `Stock: ${p.stock}` : '⚠️ Out of stock'}
                                            </span>
                                            {p.badge && <span style={ds.badge}>{p.badge}</span>}
                                        </div>
                                    </div>
                                    <div style={ds.editArrow}>›</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={openNew} style={ds.fab} aria-label="Add product">＋</button>
                </div>
            )}

            {/* ═══ ORDERS TAB ═══ */}
            {tab === 'orders' && (
                <div style={ds.tabContent}>
                    {/* Add Order Toggle */}
                    <div style={{ ...fn.addToggleRow, marginBottom: 16 }}>
                        <span style={fn.sectionTitle}>📦 Manage Orders</span>
                        <button onClick={() => setShowOrderForm(v => !v)} style={fn.addToggleBtn}>
                            {showOrderForm ? '✕ Cancel' : '＋ Add Manual Order'}
                        </button>
                    </div>

                    {showOrderForm && (
                        <div style={fn.formCard}>
                            <div style={fn.formGrid}>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Customer Name</label>
                                    <input type="text" value={orderForm.delivery_name} placeholder="John Doe"
                                        onChange={e => setOrderForm(f => ({ ...f, delivery_name: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Phone</label>
                                    <input type="text" value={orderForm.delivery_phone} placeholder="07XX XXX XXX"
                                        onChange={e => setOrderForm(f => ({ ...f, delivery_phone: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Address/Location</label>
                                    <input type="text" value={orderForm.delivery_address} placeholder="Kampala"
                                        onChange={e => setOrderForm(f => ({ ...f, delivery_address: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Items Description</label>
                                    <input type="text" value={orderForm.items_desc} placeholder="E.g. 5kg Tomatoes, 1 Bag Potatoes"
                                        onChange={e => setOrderForm(f => ({ ...f, items_desc: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Total Amount (UGX)</label>
                                    <input type="number" inputMode="numeric" value={orderForm.total_amount} placeholder="15000"
                                        onChange={e => setOrderForm(f => ({ ...f, total_amount: e.target.value }))}
                                        style={fn.finput} min="0" />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Date</label>
                                    <input type="date" value={orderForm.created_at}
                                        onChange={e => setOrderForm(f => ({ ...f, created_at: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Status</label>
                                    <select value={orderForm.status}
                                        onChange={e => setOrderForm(f => ({ ...f, status: e.target.value }))}
                                        style={fn.finput}>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="dispatched">Dispatched</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                            <button disabled={orderSaving} style={{ ...fn.saveRecordBtn, opacity: orderSaving ? 0.7 : 1 }}
                                onClick={async () => {
                                    if (!orderForm.delivery_name || !orderForm.total_amount) {
                                        showToast('Name and total amount are required', 'error'); return;
                                    }
                                    setOrderSaving(true);

                                    const dateObj = new Date(orderForm.created_at);
                                    dateObj.setHours(new Date().getHours());
                                    dateObj.setMinutes(new Date().getMinutes());

                                    const orderData = {
                                        delivery_name: orderForm.delivery_name,
                                        delivery_phone: orderForm.delivery_phone || 'N/A',
                                        delivery_address: orderForm.delivery_address || 'N/A',
                                        total_amount: Number(orderForm.total_amount),
                                        status: orderForm.status,
                                        created_at: dateObj.toISOString()
                                    };

                                    const itemsData = orderForm.items_desc ? [
                                        { name: orderForm.items_desc, unit: 'Manual Entry', price: Number(orderForm.total_amount), quantity: 1 }
                                    ] : [];

                                    const { error } = await adminAddOrder(orderData, itemsData);

                                    setOrderSaving(false);
                                    if (error) { showToast('Save failed: ' + error.message, 'error'); }
                                    else {
                                        showToast('Order added manually!');
                                        setOrderForm({ delivery_name: '', delivery_phone: '', delivery_address: '', total_amount: '', items_desc: '', status: 'delivered', created_at: new Date().toISOString().split('T')[0] });
                                        setShowOrderForm(false);
                                        loadAll();
                                    }
                                }}>
                                {orderSaving ? 'Saving...' : '＋ Save Manual Order'}
                            </button>
                        </div>
                    )}

                    <div style={{ ...ds.countRow, marginTop: 12 }}>
                        <span style={ds.countText}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                        <button onClick={loadAll} style={ds.refreshBtn}>↻ Refresh</button>
                    </div>
                    {dataLoading ? (
                        <div style={ds.center}><div style={ds.spinner} /></div>
                    ) : orders.length === 0 ? (
                        <div style={ds.empty}>No orders yet 📭</div>
                    ) : (
                        <div style={ds.orderList}>
                            {orders.map(o => (
                                <div key={o.id} style={ds.orderCard}>
                                    <div style={ds.orderTop}>
                                        <div>
                                            <div style={ds.orderName}>{o.delivery_name}</div>
                                            <div style={ds.orderSub}>{o.delivery_phone}</div>
                                            <div style={ds.orderSub}>{new Date(o.created_at).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={ds.orderTotal}>{fmt(o.total_amount)}</div>
                                            <span style={{ ...ds.statusBadge, background: STATUS_COLORS[o.status] }}>{o.status}</span>
                                        </div>
                                    </div>
                                    <div style={ds.orderItems}>
                                        {(o.order_items || []).map(item => (
                                            <div key={item.id} style={ds.orderItem}>
                                                {item.image && <img src={item.image} alt="" style={ds.orderItemImg} onError={e => e.target.style.display = 'none'} />}
                                                <span style={ds.orderItemText}>{item.name} ×{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={ds.orderAddr}>📍 {o.delivery_address}</div>
                                    {o.status !== 'delivered' && o.status !== 'cancelled' && (
                                        <button onClick={() => handleStatusChange(o.id, STATUS_NEXT[o.status])} style={ds.advanceBtn}>
                                            Mark as {STATUS_NEXT[o.status]} →
                                        </button>
                                    )}
                                    {o.status === 'pending' && (
                                        <button onClick={() => handleStatusChange(o.id, 'cancelled')} style={ds.cancelOrderBtn}>Cancel order</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ═══ FINANCE TAB ═══ */}
            {tab === 'finance' && (
                <div style={ds.tabContent}>
                    {/* Stat Cards */}
                    <div style={fn.statsRow}>
                        {[
                            { label: "Today", val: finStats.today ?? 0, sub: `${finStats.txToday ?? 0} sales`, color: '#10b981' },
                            { label: "This Week", val: finStats.thisWeek ?? 0, sub: `${finStats.txWeek ?? 0} sales`, color: '#3b82f6' },
                            { label: "This Month", val: finStats.thisMonth ?? 0, sub: `${finStats.txMonth ?? 0} sales`, color: '#f59e0b' },
                        ].map(s => (
                            <div key={s.label} style={{ ...fn.statCard, borderTop: `3px solid ${s.color}` }}>
                                <div style={fn.statLabel}>{s.label}</div>
                                <div style={{ ...fn.statVal, color: s.color }}>UGX {Number(s.val).toLocaleString()}</div>
                                <div style={fn.statSub}>{s.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Add Record Toggle */}
                    <div style={fn.addToggleRow}>
                        <span style={fn.sectionTitle}>💰 Revenue Tracking</span>
                        <button onClick={() => setShowFinForm(v => !v)} style={fn.addToggleBtn}>
                            {showFinForm ? '✕ Cancel' : '＋ Add Record'}
                        </button>
                    </div>

                    {/* Add Record Form */}
                    {showFinForm && (
                        <div style={fn.formCard}>
                            <div style={fn.formGrid}>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Date</label>
                                    <input type="date" value={finForm.record_date}
                                        onChange={e => setFinForm(f => ({ ...f, record_date: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Product / Entry Name</label>
                                    <input type="text" value={finForm.product_name} placeholder="e.g. Daily Sales Total"
                                        onChange={e => setFinForm(f => ({ ...f, product_name: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Category (Optional)</label>
                                    <select value={finForm.category}
                                        onChange={e => setFinForm(f => ({ ...f, category: e.target.value }))}
                                        style={fn.finput}>
                                        <option value="other">General / Other</option>
                                        {CATEGORY_SLUGS.map(s => <option key={s} value={s}>{CATEGORY_LABELS[s]}</option>)}
                                    </select>
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Qty</label>
                                    <input type="number" inputMode="numeric" value={finForm.quantity}
                                        onChange={e => setFinForm(f => ({ ...f, quantity: e.target.value }))}
                                        style={fn.finput} min="0.1" step="0.1" />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Unit Price (UGX)</label>
                                    <input type="number" inputMode="numeric" value={finForm.unit_price} placeholder="2500"
                                        onChange={e => setFinForm(f => ({ ...f, unit_price: e.target.value }))}
                                        style={fn.finput} min="0" />
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Total (auto)</label>
                                    <div style={{ ...fn.finput, background: '#0a0d12', display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 700 }}>
                                        UGX {((Number(finForm.quantity) || 0) * (Number(finForm.unit_price) || 0)).toLocaleString()}
                                    </div>
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Payment</label>
                                    <select value={finForm.payment_method}
                                        onChange={e => setFinForm(f => ({ ...f, payment_method: e.target.value }))}
                                        style={fn.finput}>
                                        <option value="cash">Cash</option>
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                                <div style={fn.fieldG}>
                                    <label style={fn.flabel}>Notes</label>
                                    <input type="text" value={finForm.notes} placeholder="Optional note"
                                        onChange={e => setFinForm(f => ({ ...f, notes: e.target.value }))}
                                        style={fn.finput} />
                                </div>
                            </div>
                            <button disabled={finSaving} style={{ ...fn.saveRecordBtn, opacity: finSaving ? 0.7 : 1 }}
                                onClick={async () => {
                                    if (!finForm.unit_price) {
                                        showToast('Amount/Price is required', 'error'); return;
                                    }
                                    const entryName = finForm.product_name.trim() || 'Daily Sales';
                                    setFinSaving(true);
                                    const total = Math.round((Number(finForm.quantity) || 1) * (Number(finForm.unit_price) || 0));
                                    const { error } = await addFinanceRecord({
                                        ...finForm,
                                        product_name: entryName,
                                        quantity: Number(finForm.quantity) || 1,
                                        unit_price: Number(finForm.unit_price),
                                        total_amount: total,
                                    });
                                    setFinSaving(false);
                                    if (error) { showToast('Save failed: ' + error.message, 'error'); }
                                    else {
                                        showToast('Record saved ✓');
                                        setShowFinForm(false);
                                        setFinForm({ record_date: new Date().toISOString().split('T')[0], product_name: '', category: 'vegetables', quantity: '1', unit_price: '', payment_method: 'cash', notes: '' });
                                        loadFinance(); loadChart(chartMode);
                                    }
                                }}>
                                {finSaving ? '💾 Saving...' : '💾 Save Record'}
                            </button>
                        </div>
                    )}

                    {/* ── CHART ── */}
                    <div style={fn.chartCard}>
                        <div style={fn.chartHeader}>
                            <span style={fn.sectionTitle}>📈 Revenue Chart</span>
                            <div style={fn.chartTabs}>
                                {['daily', 'weekly', 'monthly'].map(m => (
                                    <button key={m} onClick={() => setChartMode(m)}
                                        style={{ ...fn.chartTab, ...(chartMode === m ? fn.chartTabActive : {}) }}>
                                        {m[0].toUpperCase() + m.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {finLoading
                            ? <div style={ds.center}><div style={ds.spinner} /></div>
                            : <FinanceLineChart data={chartData} />
                        }
                    </div>

                    {/* ── TOP PRODUCTS ── */}
                    {topProducts.length > 0 && (
                        <div style={fn.chartCard}>
                            <div style={fn.chartHeader}>
                                <span style={fn.sectionTitle}>🏆 Top Products</span>
                                <span style={fn.countText}>{topProducts.length} items</span>
                            </div>
                            <TopProductsBars data={topProducts} />
                        </div>
                    )}

                    {/* ── HISTORY ── */}
                    <div style={fn.histSection}>
                        <div style={fn.addToggleRow}>
                            <span style={fn.sectionTitle}>📋 Transaction History</span>
                            <button onClick={() => { loadFinance(); loadChart(chartMode); }} style={ds.refreshBtn}>↻ Refresh</button>
                        </div>
                        {finLoading ? <div style={ds.center}><div style={ds.spinner} /></div> :
                            finRecords.length === 0 ? <div style={ds.empty}>No records yet. Add your first sale above! 💰</div> :
                                finRecords.map(r => (
                                    <div key={r.id} style={fn.histRow}>
                                        <div style={fn.histLeft}>
                                            <div style={fn.histProduct}>{r.product_name}</div>
                                            <div style={fn.histMeta}>
                                                {new Date(r.record_date).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })} ·
                                                {' '}{r.quantity} units · {r.payment_method}
                                            </div>
                                        </div>
                                        <div style={fn.histRight}>
                                            <div style={fn.histAmt}>UGX {Number(r.total_amount).toLocaleString()}</div>
                                            <button onClick={async () => {
                                                if (!confirm('Delete this record?')) return;
                                                await deleteFinanceRecord(r.id);
                                                loadFinance(); loadChart(chartMode);
                                                showToast('Record deleted');
                                            }} style={fn.histDel}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                    </div>
                </div>
            )}

            {/* ═══ EDIT / ADD DRAWER ═══ */}
            {drawerOpen && (
                <div style={ds.drawerOverlay} onClick={closeDrawer}>
                    <div style={ds.drawer} onClick={e => e.stopPropagation()}>
                        <div style={ds.drawerHeader}>
                            <span style={ds.drawerTitle}>{editProduct ? '✏️ Edit Product' : '➕ New Product'}</span>
                            <button onClick={closeDrawer} style={ds.drawerClose}>✕</button>
                        </div>
                        <div style={ds.drawerBody}>
                            {/* Image section */}
                            <div style={ds.imgSection}>
                                <div style={ds.imgPreviewBox}>
                                    {imgPreview
                                        ? <img src={imgPreview} alt="preview" style={ds.imgPreview} onError={e => e.target.style.display = 'none'} />
                                        : <div style={ds.imgPlaceholder}>📷<br />No Image</div>
                                    }
                                    {uploading && <div style={ds.imgOverlay}><div style={ds.spinner} /></div>}
                                </div>
                                <div style={ds.imgButtons}>
                                    <button onClick={() => fileInputRef.current?.click()} style={ds.imgUploadBtn} disabled={uploading}>
                                        📷 {uploading ? 'Uploading...' : 'Upload Photo'}
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
                                    <span style={ds.orText}>or paste URL below</span>
                                    <input
                                        value={form.image}
                                        onChange={e => { setField('image', e.target.value); setImgPreview(e.target.value); }}
                                        placeholder="https://..."
                                        style={ds.urlInput}
                                    />
                                </div>
                            </div>

                            {/* Fields */}
                            {[
                                { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Fresh Tomatoes' },
                                { label: 'Unit', key: 'unit', type: 'text', placeholder: 'e.g. Per 1 kg' },
                                { label: 'Price (UGX) *', key: 'price', type: 'number', placeholder: 'e.g. 2500' },
                                { label: 'Original Price', key: 'original_price', type: 'number', placeholder: 'e.g. 3200' },
                                { label: 'Discount (%)', key: 'discount', type: 'number', placeholder: 'e.g. 22' },
                                { label: 'Stock', key: 'stock', type: 'number', placeholder: 'e.g. 50' },
                                { label: 'Badge', key: 'badge', type: 'text', placeholder: 'e.g. Organic, Best Seller' },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key} style={ds.fieldGroup}>
                                    <label style={ds.fieldLabel}>{label}</label>
                                    <input
                                        type={type}
                                        inputMode={type === 'number' ? 'numeric' : 'text'}
                                        value={form[key]}
                                        onChange={e => setField(key, e.target.value)}
                                        placeholder={placeholder}
                                        style={ds.fieldInput}
                                    />
                                </div>
                            ))}

                            {/* Category */}
                            <div style={ds.fieldGroup}>
                                <label style={ds.fieldLabel}>Category</label>
                                <select value={form.category} onChange={e => setField('category', e.target.value)} style={ds.fieldInput}>
                                    {CATEGORY_SLUGS.map(slug => (
                                        <option key={slug} value={slug}>{CATEGORY_LABELS[slug]}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div style={ds.fieldGroup}>
                                <label style={ds.fieldLabel}>Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setField('description', e.target.value)}
                                    placeholder="Describe this product..."
                                    rows={5}
                                    style={{ ...ds.fieldInput, resize: 'vertical', minHeight: 100 }}
                                />
                            </div>

                            {/* Actions */}
                            <div style={ds.drawerActions}>
                                <button onClick={handleSave} disabled={saving || uploading} style={{ ...ds.saveBtn, opacity: (saving || uploading) ? 0.7 : 1 }}>
                                    {saving ? '💾 Saving...' : editProduct ? '💾 Save Changes' : '➕ Add Product'}
                                </button>
                                {editProduct && (
                                    <button onClick={() => setConfirmDelete(editProduct.id)} style={ds.deleteBtn}>🗑️</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ DELETE CONFIRM ═══ */}
            {confirmDelete && (
                <div style={ds.drawerOverlay}>
                    <div style={ds.confirmBox}>
                        <div style={ds.confirmText}>Delete this product permanently?</div>
                        <div style={ds.confirmBtns}>
                            <button onClick={() => handleDelete(confirmDelete)} style={ds.confirmYes}>Yes, Delete</button>
                            <button onClick={() => setConfirmDelete(null)} style={ds.confirmNo}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TOAST ═══ */}
            {toast && (
                <div style={{ ...ds.toast, background: toast.type === 'error' ? '#ef4444' : '#10b981' }}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Login Page Styles
// ─────────────────────────────────────────────────────────────────────────────
const ls = {
    root: {
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0d14', fontFamily: "'Inter', system-ui, sans-serif",
        padding: 20, position: 'relative', overflow: 'hidden',
    },
    blob1: {
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        top: -100, right: -100, pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,158,71,0.12) 0%, transparent 70%)',
        bottom: -80, left: -80, pointerEvents: 'none',
    },
    card: {
        width: '100%', maxWidth: 400, background: '#141820',
        borderRadius: 24, padding: '36px 28px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        position: 'relative', zIndex: 1, textAlign: 'center',
    },
    logo: { display: 'flex', justifyContent: 'center', marginBottom: 14 },
    appName: { fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: '#10b981', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28, marginTop: 4 },
    form: { textAlign: 'left', marginBottom: 20 },
    fieldWrap: { marginBottom: 16 },
    label: { display: 'block', fontSize: 12, color: '#9ca3af', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: {
        width: '100%', boxSizing: 'border-box', padding: '13px 16px',
        background: '#1e2330', border: '1.5px solid #2a2f3e', borderRadius: 12,
        color: '#f0f0f0', fontSize: 15, outline: 'none', fontFamily: 'inherit',
        transition: 'border-color .2s',
    },
    pwWrap: { position: 'relative' },
    eyeBtn: {
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4,
    },
    errorBox: {
        background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 10, padding: '10px 14px', color: '#f87171', fontSize: 13,
        marginBottom: 14,
    },
    submitBtn: {
        width: '100%', padding: '15px', background: 'linear-gradient(135deg, #10b981, #059669)',
        border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15,
        cursor: 'pointer', transition: 'opacity .2s', fontFamily: 'inherit',
        boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
    },
    spinnerSmall: {
        display: 'inline-block', width: 16, height: 16,
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid #fff', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
    },
    infoBox: {
        background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 10, padding: '12px 14px', color: '#93c5fd', fontSize: 13,
        marginBottom: 20, textAlign: 'left', lineHeight: 1.4,
    },
    hint: { fontSize: 12, color: '#4b5563', marginBottom: 16 },
    backLink: { fontSize: 13, color: '#6b7280', textDecoration: 'none', display: 'inline-block' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Styles
// ─────────────────────────────────────────────────────────────────────────────
const ds = {
    root: { minHeight: '100dvh', background: '#0f1117', color: '#f0f0f0', fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 },
    topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#1a1d27', borderBottom: '1px solid #2a2d3a', position: 'sticky', top: 0, zIndex: 100 },
    topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    topTitle: { fontWeight: 700, fontSize: 17, color: '#fff' },
    topSub: { fontSize: 11, color: '#6b7280', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    logoutBtn: { background: 'transparent', border: '1px solid #374151', color: '#9ca3af', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },

    statsBar: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: '#2a2d3a', margin: '0 0 1px' },
    statCard: { background: '#1a1d27', padding: '14px 8px', textAlign: 'center' },
    statIcon: { fontSize: 20 },
    statVal: { fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.2 },
    statLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },

    tabBar: { display: 'flex', background: '#1a1d27', borderBottom: '2px solid #2a2d3a' },
    tabBtn: { flex: 1, padding: '12px 0', background: 'transparent', border: 'none', color: '#6b7280', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
    tabActive: { color: '#10b981', borderBottom: '2px solid #10b981', marginBottom: -2 },

    tabContent: { padding: '0 0 16px' },

    searchInput: { width: '100%', boxSizing: 'border-box', padding: '12px 16px', background: '#1a1d27', border: 'none', borderBottom: '1px solid #2a2d3a', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
    chips: { display: 'flex', gap: 8, padding: '10px 12px', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid #2a2d3a' },
    chip: { flexShrink: 0, padding: '5px 12px', borderRadius: 20, background: '#2a2d3a', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' },
    chipActive: { background: '#10b981', color: '#fff' },

    countRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' },
    countText: { fontSize: 12, color: '#6b7280' },
    refreshBtn: { background: 'transparent', border: 'none', color: '#10b981', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },

    productList: { display: 'flex', flexDirection: 'column' },
    productRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #1e2130', cursor: 'pointer', background: '#0f1117', transition: 'background .15s' },
    productThumb: { width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: '#2a2d3a' },
    productInfo: { flex: 1, minWidth: 0 },
    productName: { fontWeight: 600, fontSize: 14, color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productMeta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 },
    catChip: { fontSize: 10, padding: '2px 7px', background: '#2a2d3a', borderRadius: 10, color: '#9ca3af' },
    priceText: { fontSize: 13, fontWeight: 600, color: '#10b981' },
    stockRow: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 },
    badge: { fontSize: 10, padding: '2px 7px', background: '#facc15', color: '#000', borderRadius: 10, fontWeight: 600 },
    editArrow: { fontSize: 22, color: '#374151', flexShrink: 0 },

    fab: { position: 'fixed', bottom: 24, right: 20, width: 54, height: 54, borderRadius: 27, background: '#10b981', color: '#fff', border: 'none', fontSize: 28, lineHeight: '54px', textAlign: 'center', boxShadow: '0 4px 20px rgba(16,185,129,.5)', cursor: 'pointer', zIndex: 50, fontFamily: 'inherit' },

    orderList: { display: 'flex', flexDirection: 'column', gap: 12, padding: 12 },
    orderCard: { background: '#1a1d27', borderRadius: 14, padding: 16, border: '1px solid #2a2d3a' },
    orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    orderName: { fontWeight: 700, fontSize: 15, color: '#fff' },
    orderSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    orderTotal: { fontWeight: 700, fontSize: 16, color: '#10b981' },
    statusBadge: { display: 'inline-block', marginTop: 4, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, color: '#fff', textTransform: 'capitalize' },
    orderItems: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 },
    orderItem: { display: 'flex', alignItems: 'center', gap: 8 },
    orderItemImg: { width: 30, height: 30, borderRadius: 6, objectFit: 'cover' },
    orderItemText: { fontSize: 13, color: '#d1d5db' },
    orderAddr: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
    advanceBtn: { width: '100%', padding: '10px', background: '#10b981', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 6, fontFamily: 'inherit' },
    cancelOrderBtn: { width: '100%', padding: '8px', background: 'transparent', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },

    drawerOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end' },
    drawer: { width: '100%', maxHeight: '92dvh', background: '#1a1d27', borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #2a2d3a', flexShrink: 0 },
    drawerTitle: { fontWeight: 700, fontSize: 17, color: '#fff' },
    drawerClose: { background: 'transparent', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer', padding: '0 4px', fontFamily: 'inherit' },
    drawerBody: { overflowY: 'auto', padding: '16px 20px', flex: 1 },

    imgSection: { display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' },
    imgPreviewBox: { width: 90, height: 90, borderRadius: 12, background: '#2a2d3a', flexShrink: 0, overflow: 'hidden', position: 'relative' },
    imgPreview: { width: '100%', height: '100%', objectFit: 'cover' },
    imgPlaceholder: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontSize: 11, textAlign: 'center' },
    imgOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    imgButtons: { flex: 1, display: 'flex', flexDirection: 'column', gap: 8 },
    imgUploadBtn: { padding: '10px 14px', background: '#10b981', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
    orText: { fontSize: 11, color: '#6b7280' },
    urlInput: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#0f1117', border: '1px solid #374151', borderRadius: 8, color: '#f0f0f0', fontSize: 12, outline: 'none', fontFamily: 'inherit' },

    fieldGroup: { marginBottom: 14 },
    fieldLabel: { display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 5, fontWeight: 500 },
    fieldInput: { width: '100%', boxSizing: 'border-box', padding: '11px 14px', background: '#0f1117', border: '1px solid #374151', borderRadius: 10, color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: 'inherit' },

    drawerActions: { display: 'flex', gap: 10, marginTop: 8 },
    saveBtn: { flex: 1, padding: '14px', background: '#10b981', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' },
    deleteBtn: { padding: '14px 18px', background: 'transparent', border: '1px solid #ef4444', borderRadius: 10, color: '#ef4444', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },

    confirmBox: { background: '#1a1d27', borderRadius: 16, padding: 24, margin: 'auto 20px', width: 'calc(100% - 40px)', boxSizing: 'border-box' },
    confirmText: { fontSize: 16, color: '#fff', fontWeight: 600, textAlign: 'center', marginBottom: 20 },
    confirmBtns: { display: 'flex', gap: 10 },
    confirmYes: { flex: 1, padding: 12, background: '#ef4444', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
    confirmNo: { flex: 1, padding: 12, background: '#2a2d3a', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },

    toast: { position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14, zIndex: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,.4)' },

    center: { display: 'flex', justifyContent: 'center', padding: 40 },
    spinner: { width: 32, height: 32, border: '3px solid #2a2d3a', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};

const fn = {
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24, padding: '0 16px' },
    statCard: { background: '#1a1d27', padding: '16px', borderRadius: 12, border: '1px solid #2a2d3a' },
    statLabel: { fontSize: 13, color: '#9ca3af', marginBottom: 6 },
    statVal: { fontSize: 20, fontWeight: 800, marginBottom: 4 },
    statSub: { fontSize: 12, color: '#6b7280' },

    addToggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 700, color: '#f0f0f0' },
    addToggleBtn: { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'none', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },

    formCard: { background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, margin: '0 16px 24px', padding: 20 },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 20 },
    fieldG: { display: 'flex', flexDirection: 'column', gap: 6 },
    flabel: { fontSize: 12, color: '#9ca3af', fontWeight: 500 },
    finput: { width: '100%', boxSizing: 'border-box', background: '#0f1117', border: '1px solid #374151', color: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' },

    saveRecordBtn: { width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },

    chartCard: { background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 14, margin: '0 16px 24px', padding: 20 },
    chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    chartTabs: { display: 'flex', background: '#0f1117', borderRadius: 20, padding: 2 },
    chartTab: { background: 'transparent', border: 'none', color: '#6b7280', padding: '6px 14px', borderRadius: 18, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
    chartTabActive: { background: '#2a2d3a', color: '#f0f0f0' },

    countText: { fontSize: 13, color: '#10b981', fontWeight: 600 },

    histSection: { margin: '0 16px 16px' },
    histRow: { background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    histLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
    histProduct: { fontSize: 15, fontWeight: 600, color: '#f0f0f0' },
    histMeta: { fontSize: 12, color: '#9ca3af' },
    histRight: { display: 'flex', alignItems: 'center', gap: 14 },
    histAmt: { fontSize: 15, fontWeight: 700, color: '#10b981' },
    histDel: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Custom Chart Components
// ─────────────────────────────────────────────────────────────────────────────
function FinanceLineChart({ data }) {
    if (!data || data.length === 0) return <div style={ds.empty}>No data for this period</div>;

    const maxAmt = Math.max(...data.map(d => Number(d.amount) || 0), 1);

    return (
        <div style={{ height: 250, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 40, overflowX: 'auto', paddingBottom: 10 }}>
            {data.map((d, i) => {
                const heightPct = ((Number(d.amount) || 0) / maxAmt) * 100;
                return (
                    <div key={i} style={{ flex: '1 0 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <div style={{ fontSize: 10, color: '#10b981', marginBottom: 6, opacity: heightPct > 0 ? 1 : 0, transform: 'rotate(-45deg)', transformOrigin: 'left bottom' }}>
                            {Number(d.amount) > 0 ? (Number(d.amount) / 1000).toFixed(1) + 'k' : ''}
                        </div>
                        <div style={{ width: '100%', background: '#10b981', borderRadius: '4px 4px 0 0', height: `${Math.max(heightPct, 2)}%`, minHeight: 4, transition: 'height .3s' }} />
                        <div style={{ fontSize: 10, color: '#6b7280', marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
                            {d.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TopProductsBars({ data }) {
    if (!data || data.length === 0) return <div style={ds.empty}>No products sold yet</div>;

    const maxRev = Math.max(...data.map(d => d.total_revenue || 0), 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            {data.map((d, i) => {
                const pct = ((d.total_revenue || 0) / maxRev) * 100;
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: '#fff', fontWeight: 600 }}>{d.product_name}</span>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>UGX {Number(d.total_revenue || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: '#2a2d3a', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 4 }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>
                            {d.total_qty} units sold
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

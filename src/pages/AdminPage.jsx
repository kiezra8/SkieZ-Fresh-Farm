import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    adminFetchAllProducts, adminUpdateProduct,
    adminAddProduct, adminDeleteProduct,
    uploadProductImage, adminFetchStats,
    adminFetchAllOrders, adminUpdateOrderStatus,
} from '../lib/adminService';

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `UGX ${Number(n).toLocaleString()}`;

// ─── Blank product template ───────────────────────────────────────────────────
const BLANK = {
    name: '', category: 'vegetables', unit: 'Per 1 kg', price: '', original_price: '',
    discount: '0', rating: '5.0', reviews: '0', image: '', description: '', stock: '0', badge: '',
};

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const [tab, setTab] = useState('products'); // 'products' | 'orders'
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [filterCat, setFilterCat] = useState('all');
    const [search, setSearch] = useState('');
    const [dataLoading, setDataLoading] = useState(true);

    // Edit / add drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null); // null = new
    const [form, setForm] = useState(BLANK);
    const [imgPreview, setImgPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const fileInputRef = useRef();

    // ── Auth gate ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
            navigate('/account');
        }
    }, [user, loading, navigate]);

    // ── Load data ──────────────────────────────────────────────────────────────
    const loadAll = useCallback(async () => {
        setDataLoading(true);
        const [pRes, oRes, sRes] = await Promise.all([
            adminFetchAllProducts(),
            adminFetchAllOrders(),
            adminFetchStats(),
        ]);
        if (pRes.data) setProducts(pRes.data);
        if (oRes.data) setOrders(oRes.data);
        setStats(sRes);
        setDataLoading(false);
    }, []);

    useEffect(() => { if (user?.email === ADMIN_EMAIL) loadAll(); }, [user, loadAll]);

    // ── Toast helper ──────────────────────────────────────────────────────────
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Open drawer ───────────────────────────────────────────────────────────
    const openNew = () => {
        setEditProduct(null);
        setForm(BLANK);
        setImgPreview('');
        setDrawerOpen(true);
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

    // ── Field change ──────────────────────────────────────────────────────────
    const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

    // ── Image upload from phone ───────────────────────────────────────────────
    const handleImageFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Local preview immediately
        const localUrl = URL.createObjectURL(file);
        setImgPreview(localUrl);
        setUploading(true);
        const productId = editProduct?.id ?? `new_${Date.now()}`;
        const { url, error } = await uploadProductImage(file, productId);
        setUploading(false);
        if (error) { showToast('Upload failed: ' + error.message, 'error'); return; }
        setField('image', url);
        setImgPreview(url);
        showToast('Image uploaded ✓');
    };

    // ── Save product ──────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.name || !form.price) {
            showToast('Name and price are required', 'error'); return;
        }
        setSaving(true);
        const payload = {
            name: form.name.trim(),
            category: form.category,
            unit: form.unit.trim(),
            price: Number(form.price),
            original_price: form.original_price ? Number(form.original_price) : null,
            discount: Number(form.discount) || 0,
            rating: parseFloat(form.rating) || 5.0,
            reviews: Number(form.reviews) || 0,
            image: form.image,
            description: form.description.trim(),
            stock: Number(form.stock) || 0,
            badge: form.badge.trim(),
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

    // ── Delete product ────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const { error } = await adminDeleteProduct(id);
        if (error) { showToast('Delete failed', 'error'); }
        else {
            setProducts(ps => ps.filter(p => p.id !== id));
            showToast('Product deleted');
            if (drawerOpen) closeDrawer();
        }
        setConfirmDelete(null);
    };

    // ── Order status advance ──────────────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        const { error } = await adminUpdateOrderStatus(orderId, newStatus);
        if (!error) setOrders(os => os.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        else showToast('Status update failed', 'error');
    };

    // ── Filtered products ─────────────────────────────────────────────────────
    const filtered = products.filter(p => {
        const matchCat = filterCat === 'all' || p.category === filterCat;
        const q = search.toLowerCase();
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.includes(q);
        return matchCat && matchSearch;
    });

    if (loading || !user) return null;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={styles.root}>
            {/* ── Top Bar ── */}
            <div style={styles.topBar}>
                <div style={styles.topLeft}>
                    <span style={styles.topLogo}>⚙️</span>
                    <div>
                        <div style={styles.topTitle}>Admin Panel</div>
                        <div style={styles.topSub}>SkieZ Fresh Farm</div>
                    </div>
                </div>
                <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
            </div>

            {/* ── Stats Bar ── */}
            <div style={styles.statsBar}>
                {[
                    { label: 'Products', value: stats.productCount ?? '—', icon: '🥦' },
                    { label: 'Orders', value: stats.orderCount ?? '—', icon: '📦' },
                    { label: 'Pending', value: stats.pendingCount ?? '—', icon: '⏳' },
                ].map(s => (
                    <div key={s.label} style={styles.statCard}>
                        <div style={styles.statIcon}>{s.icon}</div>
                        <div style={styles.statVal}>{s.value}</div>
                        <div style={styles.statLabel}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Tab Bar ── */}
            <div style={styles.tabBar}>
                {['products', 'orders'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }}
                    >
                        {t === 'products' ? '🥦 Products' : '📦 Orders'}
                    </button>
                ))}
            </div>

            {/* ══════════ PRODUCTS TAB ══════════ */}
            {tab === 'products' && (
                <div style={styles.tabContent}>
                    {/* Search */}
                    <input
                        placeholder="🔍  Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />

                    {/* Category filter chips */}
                    <div style={styles.chips}>
                        <button
                            onClick={() => setFilterCat('all')}
                            style={{ ...styles.chip, ...(filterCat === 'all' ? styles.chipActive : {}) }}
                        >All</button>
                        {CATEGORY_SLUGS.map(slug => (
                            <button
                                key={slug}
                                onClick={() => setFilterCat(slug)}
                                style={{ ...styles.chip, ...(filterCat === slug ? styles.chipActive : {}) }}
                            >{CATEGORY_LABELS[slug]}</button>
                        ))}
                    </div>

                    {/* Product count */}
                    <div style={styles.countRow}>
                        <span style={styles.countText}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
                        <button onClick={loadAll} style={styles.refreshBtn}>↻ Refresh</button>
                    </div>

                    {/* Product List */}
                    {dataLoading ? (
                        <div style={styles.center}><div style={styles.spinner} /></div>
                    ) : (
                        <div style={styles.productList}>
                            {filtered.map(p => (
                                <div key={p.id} style={styles.productRow} onClick={() => openEdit(p)}>
                                    <img
                                        src={p.image || 'https://via.placeholder.com/60'}
                                        alt={p.name}
                                        style={styles.productThumb}
                                        onError={e => e.target.src = 'https://via.placeholder.com/60'}
                                    />
                                    <div style={styles.productInfo}>
                                        <div style={styles.productName}>{p.name}</div>
                                        <div style={styles.productMeta}>
                                            <span style={styles.catChip}>{CATEGORY_LABELS[p.category] || p.category}</span>
                                            <span style={styles.priceText}>{fmt(p.price)}</span>
                                        </div>
                                        <div style={styles.stockRow}>
                                            <span style={{ color: p.stock > 10 ? '#10b981' : '#ef4444', fontSize: 12 }}>
                                                {p.stock > 0 ? `Stock: ${p.stock}` : '⚠️ Out of stock'}
                                            </span>
                                            {p.badge && <span style={styles.badge}>{p.badge}</span>}
                                        </div>
                                    </div>
                                    <div style={styles.editArrow}>›</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FAB Add button */}
                    <button onClick={openNew} style={styles.fab}>＋</button>
                </div>
            )}

            {/* ══════════ ORDERS TAB ══════════ */}
            {tab === 'orders' && (
                <div style={styles.tabContent}>
                    <div style={styles.countRow}>
                        <span style={styles.countText}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                        <button onClick={loadAll} style={styles.refreshBtn}>↻ Refresh</button>
                    </div>
                    {dataLoading ? (
                        <div style={styles.center}><div style={styles.spinner} /></div>
                    ) : orders.length === 0 ? (
                        <div style={styles.empty}>No orders yet</div>
                    ) : (
                        <div style={styles.orderList}>
                            {orders.map(o => (
                                <div key={o.id} style={styles.orderCard}>
                                    <div style={styles.orderTop}>
                                        <div>
                                            <div style={styles.orderName}>{o.delivery_name}</div>
                                            <div style={styles.orderSub}>{o.delivery_phone}</div>
                                            <div style={styles.orderSub}>
                                                {new Date(o.created_at).toLocaleDateString('en-UG', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={styles.orderTotal}>{fmt(o.total_amount)}</div>
                                            <span style={{ ...styles.statusBadge, background: STATUS_COLORS[o.status] }}>
                                                {o.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items summary */}
                                    <div style={styles.orderItems}>
                                        {(o.order_items || []).map(item => (
                                            <div key={item.id} style={styles.orderItem}>
                                                {item.image && <img src={item.image} alt="" style={styles.orderItemImg} />}
                                                <span style={styles.orderItemText}>
                                                    {item.name} ×{item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Address */}
                                    <div style={styles.orderAddr}>📍 {o.delivery_address}</div>

                                    {/* Status advance */}
                                    {o.status !== 'delivered' && o.status !== 'cancelled' && (
                                        <button
                                            onClick={() => handleStatusChange(o.id, STATUS_NEXT[o.status])}
                                            style={styles.advanceBtn}
                                        >
                                            Mark as {STATUS_NEXT[o.status]} →
                                        </button>
                                    )}
                                    {o.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusChange(o.id, 'cancelled')}
                                            style={styles.cancelOrderBtn}
                                        >Cancel order</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ══════════ EDIT / ADD DRAWER ══════════ */}
            {drawerOpen && (
                <div style={styles.drawerOverlay} onClick={closeDrawer}>
                    <div style={styles.drawer} onClick={e => e.stopPropagation()}>
                        {/* Drawer header */}
                        <div style={styles.drawerHeader}>
                            <span style={styles.drawerTitle}>
                                {editProduct ? '✏️ Edit Product' : '➕ New Product'}
                            </span>
                            <button onClick={closeDrawer} style={styles.drawerClose}>✕</button>
                        </div>

                        <div style={styles.drawerBody}>
                            {/* ── Image section ── */}
                            <div style={styles.imgSection}>
                                <div style={styles.imgPreviewBox}>
                                    {imgPreview ? (
                                        <img src={imgPreview} alt="preview" style={styles.imgPreview} />
                                    ) : (
                                        <div style={styles.imgPlaceholder}>📷<br />No Image</div>
                                    )}
                                    {uploading && <div style={styles.imgOverlay}><div style={styles.spinner} /></div>}
                                </div>
                                <div style={styles.imgButtons}>
                                    {/* Upload from phone */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={styles.imgUploadBtn}
                                        disabled={uploading}
                                    >
                                        📷 {uploading ? 'Uploading...' : 'Upload Photo'}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImageFile}
                                    />
                                    <span style={styles.orText}>or paste URL below</span>
                                    <input
                                        value={form.image}
                                        onChange={e => { setField('image', e.target.value); setImgPreview(e.target.value); }}
                                        placeholder="https://..."
                                        style={styles.urlInput}
                                    />
                                </div>
                            </div>

                            {/* ── Fields ── */}
                            {[
                                { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Fresh Tomatoes' },
                                { label: 'Unit', key: 'unit', type: 'text', placeholder: 'e.g. Per 1 kg' },
                                { label: 'Price (UGX) *', key: 'price', type: 'number', placeholder: 'e.g. 2500' },
                                { label: 'Original Price', key: 'original_price', type: 'number', placeholder: 'e.g. 3200' },
                                { label: 'Discount (%)', key: 'discount', type: 'number', placeholder: 'e.g. 22' },
                                { label: 'Stock', key: 'stock', type: 'number', placeholder: 'e.g. 50' },
                                { label: 'Badge', key: 'badge', type: 'text', placeholder: 'e.g. Organic, Best Seller' },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key} style={styles.fieldGroup}>
                                    <label style={styles.fieldLabel}>{label}</label>
                                    <input
                                        type={type}
                                        inputMode={type === 'number' ? 'numeric' : 'text'}
                                        value={form[key]}
                                        onChange={e => setField(key, e.target.value)}
                                        placeholder={placeholder}
                                        style={styles.fieldInput}
                                    />
                                </div>
                            ))}

                            {/* Category select */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.fieldLabel}>Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setField('category', e.target.value)}
                                    style={styles.fieldInput}
                                >
                                    {CATEGORY_SLUGS.map(slug => (
                                        <option key={slug} value={slug}>{CATEGORY_LABELS[slug]}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.fieldLabel}>Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setField('description', e.target.value)}
                                    placeholder="Describe this product..."
                                    rows={5}
                                    style={{ ...styles.fieldInput, resize: 'vertical', minHeight: 100 }}
                                />
                            </div>

                            {/* Actions */}
                            <div style={styles.drawerActions}>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || uploading}
                                    style={styles.saveBtn}
                                >
                                    {saving ? '💾 Saving...' : editProduct ? '💾 Save Changes' : '➕ Add Product'}
                                </button>
                                {editProduct && (
                                    <button
                                        onClick={() => setConfirmDelete(editProduct.id)}
                                        style={styles.deleteBtn}
                                    >🗑️ Delete</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ DELETE CONFIRM ══════════ */}
            {confirmDelete && (
                <div style={styles.drawerOverlay}>
                    <div style={styles.confirmBox}>
                        <div style={styles.confirmText}>Delete this product permanently?</div>
                        <div style={styles.confirmBtns}>
                            <button onClick={() => handleDelete(confirmDelete)} style={styles.confirmYes}>Yes, Delete</button>
                            <button onClick={() => setConfirmDelete(null)} style={styles.confirmNo}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ TOAST ══════════ */}
            {toast && (
                <div style={{ ...styles.toast, background: toast.type === 'error' ? '#ef4444' : '#10b981' }}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles — fully mobile-first
// ─────────────────────────────────────────────────────────────────────────────
const styles = {
    root: {
        minHeight: '100dvh', background: '#0f1117', color: '#f0f0f0',
        fontFamily: "'Inter', system-ui, sans-serif",
        paddingBottom: 80,
    },
    topBar: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: '#1a1d27',
        borderBottom: '1px solid #2a2d3a', position: 'sticky', top: 0, zIndex: 100,
    },
    topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    topLogo: { fontSize: 26 },
    topTitle: { fontWeight: 700, fontSize: 17, color: '#fff' },
    topSub: { fontSize: 11, color: '#6b7280' },
    logoutBtn: {
        background: 'transparent', border: '1px solid #374151', color: '#9ca3af',
        borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer',
    },

    statsBar: {
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1,
        background: '#2a2d3a', margin: '0 0 1px',
    },
    statCard: {
        background: '#1a1d27', padding: '14px 8px', textAlign: 'center',
    },
    statIcon: { fontSize: 20 },
    statVal: { fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.2 },
    statLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },

    tabBar: {
        display: 'flex', background: '#1a1d27',
        borderBottom: '2px solid #2a2d3a',
    },
    tabBtn: {
        flex: 1, padding: '12px 0', background: 'transparent', border: 'none',
        color: '#6b7280', fontSize: 14, fontWeight: 500, cursor: 'pointer',
        transition: 'color .2s',
    },
    tabActive: {
        color: '#10b981', borderBottom: '2px solid #10b981', marginBottom: -2,
    },

    tabContent: { padding: '0 0 16px' },

    searchInput: {
        width: '100%', boxSizing: 'border-box',
        padding: '12px 16px', background: '#1a1d27', border: 'none',
        borderBottom: '1px solid #2a2d3a', color: '#f0f0f0',
        fontSize: 14, outline: 'none',
    },
    chips: {
        display: 'flex', gap: 8, padding: '10px 12px', overflowX: 'auto',
        scrollbarWidth: 'none', borderBottom: '1px solid #2a2d3a',
    },
    chip: {
        flexShrink: 0, padding: '5px 12px', borderRadius: 20,
        background: '#2a2d3a', border: 'none', color: '#9ca3af',
        fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
    },
    chipActive: { background: '#10b981', color: '#fff' },

    countRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px',
    },
    countText: { fontSize: 12, color: '#6b7280' },
    refreshBtn: {
        background: 'transparent', border: 'none', color: '#10b981',
        fontSize: 12, cursor: 'pointer',
    },

    productList: { display: 'flex', flexDirection: 'column' },
    productRow: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', borderBottom: '1px solid #1e2130',
        cursor: 'pointer', transition: 'background .15s',
        background: '#0f1117',
    },
    productThumb: {
        width: 56, height: 56, borderRadius: 10, objectFit: 'cover',
        flexShrink: 0, background: '#2a2d3a',
    },
    productInfo: { flex: 1, minWidth: 0 },
    productName: { fontWeight: 600, fontSize: 14, color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productMeta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 },
    catChip: {
        fontSize: 10, padding: '2px 7px', background: '#2a2d3a',
        borderRadius: 10, color: '#9ca3af',
    },
    priceText: { fontSize: 13, fontWeight: 600, color: '#10b981' },
    stockRow: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 },
    badge: {
        fontSize: 10, padding: '2px 7px', background: '#facc15',
        color: '#000', borderRadius: 10, fontWeight: 600,
    },
    editArrow: { fontSize: 22, color: '#374151', flexShrink: 0 },

    fab: {
        position: 'fixed', bottom: 24, right: 20, width: 54, height: 54,
        borderRadius: 27, background: '#10b981', color: '#fff',
        border: 'none', fontSize: 28, lineHeight: '54px', textAlign: 'center',
        boxShadow: '0 4px 20px rgba(16,185,129,.5)', cursor: 'pointer', zIndex: 50,
    },

    orderList: { display: 'flex', flexDirection: 'column', gap: 12, padding: 12 },
    orderCard: {
        background: '#1a1d27', borderRadius: 14, padding: 16,
        border: '1px solid #2a2d3a',
    },
    orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    orderName: { fontWeight: 700, fontSize: 15, color: '#fff' },
    orderSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    orderTotal: { fontWeight: 700, fontSize: 16, color: '#10b981' },
    statusBadge: {
        display: 'inline-block', marginTop: 4, padding: '3px 10px', borderRadius: 12,
        fontSize: 11, fontWeight: 600, color: '#fff', textTransform: 'capitalize',
    },
    orderItems: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 },
    orderItem: { display: 'flex', alignItems: 'center', gap: 8 },
    orderItemImg: { width: 30, height: 30, borderRadius: 6, objectFit: 'cover' },
    orderItemText: { fontSize: 13, color: '#d1d5db' },
    orderAddr: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
    advanceBtn: {
        width: '100%', padding: '10px', background: '#10b981', border: 'none',
        borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        marginBottom: 6,
    },
    cancelOrderBtn: {
        width: '100%', padding: '8px', background: 'transparent',
        border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444',
        fontSize: 13, cursor: 'pointer',
    },

    // ── Drawer ──
    drawerOverlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
        zIndex: 200, display: 'flex', alignItems: 'flex-end',
    },
    drawer: {
        width: '100%', maxHeight: '92dvh', background: '#1a1d27',
        borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
    },
    drawerHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', borderBottom: '1px solid #2a2d3a', flexShrink: 0,
    },
    drawerTitle: { fontWeight: 700, fontSize: 17, color: '#fff' },
    drawerClose: {
        background: 'transparent', border: 'none', color: '#9ca3af',
        fontSize: 20, cursor: 'pointer', padding: '0 4px',
    },
    drawerBody: { overflowY: 'auto', padding: '16px 20px', flex: 1 },

    imgSection: { display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' },
    imgPreviewBox: {
        width: 90, height: 90, borderRadius: 12, background: '#2a2d3a',
        flexShrink: 0, overflow: 'hidden', position: 'relative',
    },
    imgPreview: { width: '100%', height: '100%', objectFit: 'cover' },
    imgPlaceholder: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#4b5563', fontSize: 11, textAlign: 'center',
    },
    imgOverlay: {
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    imgButtons: { flex: 1, display: 'flex', flexDirection: 'column', gap: 8 },
    imgUploadBtn: {
        padding: '10px 14px', background: '#10b981', border: 'none', borderRadius: 8,
        color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
    },
    orText: { fontSize: 11, color: '#6b7280' },
    urlInput: {
        width: '100%', boxSizing: 'border-box', padding: '8px 12px',
        background: '#0f1117', border: '1px solid #374151', borderRadius: 8,
        color: '#f0f0f0', fontSize: 12, outline: 'none',
    },

    fieldGroup: { marginBottom: 14 },
    fieldLabel: { display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 5, fontWeight: 500 },
    fieldInput: {
        width: '100%', boxSizing: 'border-box', padding: '11px 14px',
        background: '#0f1117', border: '1px solid #374151', borderRadius: 10,
        color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: 'inherit',
    },

    drawerActions: { display: 'flex', gap: 10, marginTop: 8 },
    saveBtn: {
        flex: 1, padding: '14px', background: '#10b981', border: 'none',
        borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
    },
    deleteBtn: {
        padding: '14px 18px', background: 'transparent', border: '1px solid #ef4444',
        borderRadius: 10, color: '#ef4444', fontWeight: 600, fontSize: 14, cursor: 'pointer',
    },

    // ── Confirm ──
    confirmBox: {
        background: '#1a1d27', borderRadius: 16, padding: 24,
        margin: 'auto 20px', width: 'calc(100% - 40px)', boxSizing: 'border-box',
    },
    confirmText: { fontSize: 16, color: '#fff', fontWeight: 600, textAlign: 'center', marginBottom: 20 },
    confirmBtns: { display: 'flex', gap: 10 },
    confirmYes: {
        flex: 1, padding: 12, background: '#ef4444', border: 'none',
        borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
    },
    confirmNo: {
        flex: 1, padding: 12, background: '#2a2d3a', border: 'none',
        borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
    },

    toast: {
        position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
        padding: '12px 24px', borderRadius: 12, color: '#fff',
        fontWeight: 600, fontSize: 14, zIndex: 999, whiteSpace: 'nowrap',
        boxShadow: '0 4px 20px rgba(0,0,0,.4)',
    },

    center: { display: 'flex', justifyContent: 'center', padding: 40 },
    empty: { textAlign: 'center', color: '#4b5563', padding: 40, fontSize: 15 },
    spinner: {
        width: 32, height: 32, border: '3px solid #2a2d3a',
        borderTop: '3px solid #10b981', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
};

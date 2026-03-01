// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Admin Service
// Product CRUD + Image Upload via Supabase Storage
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';

const ADMIN_EMAIL = 'israelezrakisakye@gmail.com';

// ─── Role check ──────────────────────────────────────────────────────────────
export async function isAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    if (user.email === ADMIN_EMAIL) return true;

    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return data?.role === 'admin';
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function adminFetchAllProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
    return { data, error };
}

/**
 * Update a product's fields (name, description, image, price, etc.)
 * @param {number} id - product id
 * @param {object} updates - fields to update
 */
export async function adminUpdateProduct(id, updates) {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

/**
 * Add a brand new product.
 * @param {object} product - all product fields
 */
export async function adminAddProduct(product) {
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
    return { data, error };
}

/**
 * Delete a product permanently.
 * @param {number} id
 */
export async function adminDeleteProduct(id) {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
    return { error };
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

/**
 * Upload a product image file to Supabase Storage and return the public URL.
 * @param {File}   file       - the file object from <input type="file">
 * @param {string} productId  - used to name the file
 */
export async function uploadProductImage(file, productId) {
    const ext = file.name.split('.').pop();
    const filename = `product_${productId}_${Date.now()}.${ext}`;
    const path = `products/${filename}`;

    const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type,
        });

    if (uploadErr) return { url: null, error: uploadErr };

    const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

    return { url: data.publicUrl, error: null };
}

// ─── Orders (admin view) ──────────────────────────────────────────────────────

export async function adminFetchAllOrders({ limit = 50 } = {}) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            id, created_at, status, total_amount,
            delivery_name, delivery_phone, delivery_address,
            order_items ( id, name, quantity, price, image )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
    return { data, error };
}

export async function adminUpdateOrderStatus(orderId, status) {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
    return { data, error };
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export async function adminFetchStats() {
    const [products, orders, pending] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);
    return {
        productCount: products.count ?? 0,
        orderCount: orders.count ?? 0,
        pendingCount: pending.count ?? 0,
    };
}

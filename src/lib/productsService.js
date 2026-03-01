// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Products & Categories Service
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';

// ─── Categories ──────────────────────────────────────────────────────────────

/**
 * Fetch all product categories.
 * @returns {Promise<{data: Array, error: object|null}>}
 */
export async function fetchCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
    return { data, error };
}

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * Fetch all products with optional filters.
 * @param {object} [opts]
 * @param {string} [opts.category]  - category slug to filter by
 * @param {string} [opts.search]    - full-text search string
 * @param {string} [opts.sort]      - 'price_asc' | 'price_desc' | 'rating' | 'reviews'
 * @param {number} [opts.limit]     - max records to return (default 100)
 */
export async function fetchProducts({ category, search, sort, limit = 100 } = {}) {
    let query = supabase.from('products').select(`
        id, name, category, unit, price, original_price,
        discount, rating, reviews, image, description, stock, badge
    `);

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    if (search && search.trim()) {
        query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`
        );
    }

    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (sort === 'rating') query = query.order('rating', { ascending: false });
    else if (sort === 'reviews') query = query.order('reviews', { ascending: false });
    else query = query.order('id', { ascending: true });

    query = query.limit(limit);

    const { data, error } = await query;
    return { data, error };
}

/**
 * Fetch a single product by ID.
 * @param {number|string} id
 */
export async function fetchProductById(id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
}

/**
 * Fetch hero slides for the banner carousel.
 */
export async function fetchHeroSlides() {
    const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('id', { ascending: true });
    return { data, error };
}

/**
 * Fetch ticker items for the flash deals ticker.
 */
export async function fetchTickerItems() {
    const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .order('id', { ascending: true });
    return { data, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Orders Service
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';

/**
 * Place a new order for the current authenticated user.
 *
 * @param {object} opts
 * @param {Array}  opts.items          - cart items [{id, name, price, qty, unit, image}]
 * @param {number} opts.total          - grand total in UGX
 * @param {object} opts.deliveryInfo   - { name, phone, address, notes? }
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function placeOrder({ items, total, deliveryInfo }) {
    const { data: { user } } = await supabase.auth.getUser();

    // Insert order header
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
            user_id: user?.id ?? null,
            total_amount: total,
            status: 'pending',
            delivery_name: deliveryInfo.name,
            delivery_phone: deliveryInfo.phone,
            delivery_address: deliveryInfo.address,
            delivery_notes: deliveryInfo.notes ?? null,
        })
        .select()
        .single();

    if (orderErr) return { data: null, error: orderErr };

    // Insert order line items
    const lineItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        unit: item.unit,
        price: item.price,
        quantity: item.qty,
        image: item.image,
    }));

    const { error: itemErr } = await supabase
        .from('order_items')
        .insert(lineItems);

    if (itemErr) return { data: null, error: itemErr };

    return { data: order, error: null };
}

/**
 * Fetch all orders for the currently authenticated user.
 */
export async function fetchMyOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
        .from('orders')
        .select(`
            id, created_at, status, total_amount,
            delivery_name, delivery_phone, delivery_address,
            order_items (
                id, product_id, name, unit, price, quantity, image
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return { data, error };
}

/**
 * Fetch a single order by ID (must belong to current user).
 * @param {string} orderId
 */
export async function fetchOrderById(orderId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
        .from('orders')
        .select(`
            id, created_at, status, total_amount,
            delivery_name, delivery_phone, delivery_address, delivery_notes,
            order_items (
                id, product_id, name, unit, price, quantity, image
            )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

    return { data, error };
}

/**
 * Cancel an order (user can only cancel pending orders).
 * @param {string} orderId
 */
export async function cancelOrder(orderId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .select()
        .single();

    return { data, error };
}

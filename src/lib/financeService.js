// ─────────────────────────────────────────────────────────────────────────────
// SkieZ Fresh Farm — Finance Service
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';

// ─── Add a finance record ─────────────────────────────────────────────────────
export async function addFinanceRecord(record) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('finance_records')
        .insert({ ...record, created_by: user?.id })
        .select()
        .single();
    return { data, error };
}

// ─── Update a finance record ──────────────────────────────────────────────────
export async function updateFinanceRecord(id, updates) {
    const { data, error } = await supabase
        .from('finance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

// ─── Delete a finance record ──────────────────────────────────────────────────
export async function deleteFinanceRecord(id) {
    const { error } = await supabase
        .from('finance_records')
        .delete()
        .eq('id', id);
    return { error };
}

// ─── Fetch all records (with date range) ─────────────────────────────────────
export async function fetchFinanceRecords({ limit = 200, days = 90 } = {}) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await supabase
        .from('finance_records')
        .select('*')
        .gte('record_date', since.toISOString().split('T')[0])
        .order('record_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);
    return { data, error };
}

// ─── Revenue summary stats ─────────────────────────────────────────────────────
export async function fetchFinanceStats() {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
    const monStart = new Date(); monStart.setDate(1);

    const [todayRes, weekRes, monthRes, allRes] = await Promise.all([
        supabase.from('finance_records').select('total_amount').eq('record_date', today),
        supabase.from('finance_records').select('total_amount').gte('record_date', weekStart.toISOString().split('T')[0]),
        supabase.from('finance_records').select('total_amount').gte('record_date', monStart.toISOString().split('T')[0]),
        supabase.from('finance_records').select('total_amount'),
    ]);

    const sum = (rows) => (rows || []).reduce((s, r) => s + (r.total_amount || 0), 0);
    return {
        today: sum(todayRes.data),
        thisWeek: sum(weekRes.data),
        thisMonth: sum(monthRes.data),
        allTime: sum(allRes.data),
        txToday: todayRes.data?.length ?? 0,
        txWeek: weekRes.data?.length ?? 0,
        txMonth: monthRes.data?.length ?? 0,
    };
}

// ─── Daily revenue (for line chart) ──────────────────────────────────────────
export async function fetchDailyRevenue(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days + 1);
    const sinceStr = since.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('finance_records')
        .select('record_date, total_amount')
        .gte('record_date', sinceStr)
        .order('record_date', { ascending: true });

    if (error || !data) return { data: [], error };

    // Group by date
    const map = {};
    data.forEach(r => {
        map[r.record_date] = (map[r.record_date] || 0) + r.total_amount;
    });

    // Fill in every day including zeros
    const result = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(since);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().split('T')[0];
        result.push({
            date: key,
            label: d.toLocaleDateString('en-UG', { day: 'numeric', month: 'short' }),
            amount: map[key] || 0,
        });
    }
    return { data: result, error: null };
}

// ─── Weekly revenue (last 12 weeks) ──────────────────────────────────────────
export async function fetchWeeklyRevenue(weeks = 12) {
    const since = new Date();
    since.setDate(since.getDate() - (weeks * 7) + 1);

    const { data, error } = await supabase
        .from('finance_records')
        .select('record_date, total_amount')
        .gte('record_date', since.toISOString().split('T')[0])
        .order('record_date', { ascending: true });

    if (error || !data) return { data: [], error };

    // Group into week buckets
    const map = {};
    data.forEach(r => {
        const d = new Date(r.record_date);
        const dayOfWeek = d.getDay();
        const monday = new Date(d);
        monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7)); // get Monday
        const key = monday.toISOString().split('T')[0];
        map[key] = (map[key] || 0) + r.total_amount;
    });

    const result = Object.entries(map).map(([key, amount]) => {
        const d = new Date(key);
        return {
            date: key,
            label: d.toLocaleDateString('en-UG', { day: 'numeric', month: 'short' }),
            amount,
        };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return { data: result, error: null };
}

// ─── Monthly revenue (last 12 months) ────────────────────────────────────────
export async function fetchMonthlyRevenue(months = 12) {
    const since = new Date();
    since.setMonth(since.getMonth() - months + 1);
    since.setDate(1);

    const { data, error } = await supabase
        .from('finance_records')
        .select('record_date, total_amount')
        .gte('record_date', since.toISOString().split('T')[0])
        .order('record_date', { ascending: true });

    if (error || !data) return { data: [], error };

    const map = {};
    data.forEach(r => {
        const key = r.record_date.slice(0, 7); // 'YYYY-MM'
        map[key] = (map[key] || 0) + r.total_amount;
    });

    const result = Object.entries(map).map(([key, amount]) => {
        const d = new Date(key + '-01');
        return {
            date: key,
            label: d.toLocaleDateString('en-UG', { month: 'short', year: 'numeric' }),
            amount,
        };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return { data: result, error: null };
}

// ─── Top products ─────────────────────────────────────────────────────────────
export async function fetchTopProducts(limit = 8) {
    const { data, error } = await supabase
        .from('finance_records')
        .select('product_name, category, quantity, total_amount');

    if (error || !data) return { data: [], error };

    const map = {};
    data.forEach(r => {
        if (!map[r.product_name]) {
            map[r.product_name] = { product_name: r.product_name, category: r.category, total_qty: 0, total_revenue: 0, tx: 0 };
        }
        map[r.product_name].total_qty += Number(r.quantity) || 0;
        map[r.product_name].total_revenue += r.total_amount || 0;
        map[r.product_name].tx += 1;
    });

    return {
        data: Object.values(map)
            .sort((a, b) => b.total_revenue - a.total_revenue)
            .slice(0, limit),
        error: null,
    };
}

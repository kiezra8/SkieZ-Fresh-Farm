import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Best Rated', value: 'rating' },
    { label: 'Most Reviews', value: 'reviews' },
];

export default function AllProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sort, setSort] = useState('featured');
    const [search, setSearch] = useState('');

    const activeCategory = searchParams.get('category') || 'all';

    const filtered = useMemo(() => {
        let list = [...products];
        if (activeCategory !== 'all') {
            list = list.filter(p => p.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }
        if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
        else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
        else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
        else if (sort === 'reviews') list.sort((a, b) => b.reviews - a.reviews);
        return list;
    }, [activeCategory, sort, search]);

    const catLabel = activeCategory === 'all'
        ? 'All Products'
        : categories.find(c => c.slug === activeCategory)?.name || activeCategory;

    return (
        <div className="page">
            <div className="page-header">
                <h1>{catLabel}</h1>
                <p>{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>
            </div>

            <div className="all-products-section">
                {/* Filters bar */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            padding: '8px 16px', borderRadius: 24, border: '1.5px solid #e8e8e8',
                            fontSize: 13, outline: 'none', width: 220
                        }}
                    />
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        style={{
                            padding: '8px 16px', borderRadius: 24, border: '1.5px solid #e8e8e8',
                            fontSize: 13, outline: 'none', background: '#fff', cursor: 'pointer'
                        }}
                    >
                        {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                {/* Category filter chips */}
                <div className="filters-bar" style={{ padding: '0 0 12px', border: 'none' }}>
                    <button
                        className={`filter-chip${activeCategory === 'all' ? ' active' : ''}`}
                        onClick={() => setSearchParams({})}
                    >All</button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-chip${activeCategory === cat.slug ? ' active' : ''}`}
                            onClick={() => setSearchParams({ category: cat.slug })}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                        <div style={{ fontSize: 60 }}>🔍</div>
                        <p style={{ marginTop: 12, fontSize: 15 }}>No products found matching your search.</p>
                    </div>
                ) : (
                    <div
                        className="products-grid"
                        style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
                    >
                        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

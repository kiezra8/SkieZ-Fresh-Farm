import { useNavigate } from 'react-router-dom';
import { categories } from '../data/products';

export default function CategoriesPage() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="page-header">
                <h1>Shop by Category</h1>
                <p>Browse our full range of fresh groceries and dry foods</p>
            </div>

            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 20
                }}>
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/products?category=${cat.slug}`)}
                            style={{
                                background: '#fff',
                                borderRadius: 16,
                                overflow: 'hidden',
                                border: '1.5px solid #e8e8e8',
                                cursor: 'pointer',
                                transition: 'transform .25s, box-shadow .25s',
                                boxShadow: '0 2px 12px rgba(0,0,0,.06)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,.13)'; e.currentTarget.style.borderColor = '#e63946'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)'; e.currentTarget.style.borderColor = '#e8e8e8'; }}
                        >
                            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, rgba(0,0,0,.7))',
                                    color: '#fff', padding: '20px 14px 10px',
                                    fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800
                                }}>
                                    {cat.name}
                                </span>
                                <span style={{
                                    position: 'absolute', top: 10, right: 10,
                                    background: '#e63946', color: '#fff',
                                    fontSize: 10, fontWeight: 700, padding: '3px 8px',
                                    borderRadius: 20
                                }}>
                                    {cat.badge}
                                </span>
                            </div>
                            <div style={{ padding: '12px 14px' }}>
                                <div style={{ color: '#999', fontSize: 12 }}>{cat.count} products available</div>
                                <button style={{
                                    marginTop: 8, width: '100%', background: '#e63946', color: '#fff',
                                    fontWeight: 700, fontSize: 13, padding: '8px', borderRadius: 8,
                                    border: 'none', cursor: 'pointer'
                                }}>
                                    Shop Now →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

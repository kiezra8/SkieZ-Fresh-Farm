import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import HeroBanner from '../components/HeroBanner';
import CategoriesSection from '../components/CategoriesSection';
import FlashTicker from '../components/FlashTicker';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function HomePage() {
    const navigate = useNavigate();
    const featured = products.slice(0, 10);
    const freshPicks = products.filter(p => ['vegetables', 'fruits', 'dairy'].includes(p.category));
    const dryGoods = products.filter(p => ['grains', 'flours', 'legumes', 'oils', 'sugar', 'pasta', 'spices'].includes(p.category));

    return (
        <main className="page">
            {/* Hero Banner with 3 animated slides */}
            <HeroBanner />

            {/* Flash Sale Ticker */}
            <FlashTicker />

            {/* Categories - bigger than SHEIN */}
            <CategoriesSection />

            {/* Flash Deals / Featured */}
            <section className="products-section">
                <div className="section-header">
                    <h2 className="section-title">⚡ Today's Best Deals</h2>
                    <button className="see-all" onClick={() => navigate('/products')}>
                        View All <FiArrowRight />
                    </button>
                </div>
                <div className="products-grid">
                    {featured.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </section>

            {/* Banner strip */}
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d9e47 100%)',
                padding: '32px 16px',
                text: '#fff',
                textAlign: 'center',
                margin: '16px 0'
            }}>
                <div style={{ maxWidth: 700, margin: '0 auto', color: '#fff' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#4ade80', marginBottom: 8 }}>
                        Fresh From The Farm
                    </div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 10 }}>
                        Fresh Groceries & Dry Foods – All in One Place
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 14, marginBottom: 20 }}>
                        No more running between different shops. Everything you need, from tomatoes to rice, delivered fresh to your door.
                    </p>
                    <Link to="/products" style={{
                        display: 'inline-block', background: '#e63946', color: '#fff',
                        padding: '12px 32px', borderRadius: 30, fontWeight: 700, fontSize: 14
                    }}>
                        Shop Everything →
                    </Link>
                </div>
            </div>

            {/* Fresh Picks */}
            <section className="products-section">
                <div className="section-header">
                    <h2 className="section-title">🥬 Fresh Picks</h2>
                    <button className="see-all" onClick={() => navigate('/products?category=vegetables')}>
                        All Fresh <FiArrowRight />
                    </button>
                </div>
                <div className="products-grid">
                    {freshPicks.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </section>

            {/* Dry Foods */}
            <section className="products-section">
                <div className="section-header">
                    <h2 className="section-title">🌾 Dry Pantry Staples</h2>
                    <button className="see-all" onClick={() => navigate('/products?category=grains')}>
                        All Dry Foods <FiArrowRight />
                    </button>
                </div>
                <div className="products-grid">
                    {dryGoods.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </section>
        </main>
    );
}

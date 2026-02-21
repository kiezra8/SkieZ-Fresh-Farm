import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import HeroBanner from '../components/HeroBanner';
import CategoriesSection from '../components/CategoriesSection';
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

            {/* Categories - bigger than SHEIN, directly after hero */}
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

import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function CategoriesSection() {
    const navigate = useNavigate();
    const { categories } = useData();

    return (
        <section className="categories-section">
            <div className="section-header">
                <h2 className="section-title">Shop by Category</h2>
            </div>

            <div className="categories-grid">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="category-card"
                        onClick={() => navigate(`/products?category=${cat.slug}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && navigate(`/products?category=${cat.slug}`)}
                    >
                        <div className="category-img-wrap">
                            <img src={cat.image} alt={cat.name} fetchpriority="high" decoding="async" />
                            <span className="category-badge">{cat.badge}</span>
                        </div>
                        <div className="category-info">
                            <div className="category-name">{cat.name}</div>
                            <div className="category-count">{cat.count} products</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

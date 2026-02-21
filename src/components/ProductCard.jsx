import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

function Stars({ rating }) {
    return (
        <span className="stars">
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#ddd' }}>★</span>
            ))}
        </span>
    );
}

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="product-img-wrap">
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.discount > 0 && (
                    <span className="product-discount-badge">-{product.discount}%</span>
                )}
                <button
                    className={`product-wishlist${liked ? ' liked' : ''}`}
                    onClick={e => { e.stopPropagation(); setLiked(!liked); }}
                    aria-label="Add to wishlist"
                >
                    <FiHeart style={{ fill: liked ? '#e63946' : 'none' }} />
                </button>
            </div>

            <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-unit">{product.unit}</div>
                <div className="product-rating">
                    <Stars rating={product.rating} />
                    <span className="rating-count">({product.reviews.toLocaleString()})</span>
                </div>
                <div className="product-price-row">
                    <span className="price-current">UGX {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="price-original">UGX {product.originalPrice.toLocaleString()}</span>
                    )}
                </div>
            </div>

            <button
                className={`product-add-btn${added ? ' added' : ''}`}
                onClick={handleAdd}
            >
                {added ? '✓ Added!' : 'Add to Cart'}
            </button>
        </div>
    );
}

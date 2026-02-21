import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiArrowLeft, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

function Stars({ rating }) {
    return (
        <span>
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#ddd', fontSize: 18 }}>★</span>
            ))}
        </span>
    );
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: 60 }}>😕</div>
                <h2 style={{ marginTop: 16 }}>Product not found</h2>
                <button onClick={() => navigate('/products')} className="checkout-btn" style={{ marginTop: 16, width: 'auto', padding: '12px 32px' }}>
                    Back to Products
                </button>
            </div>
        );
    }

    const handleAdd = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const savings = product.originalPrice ? (product.originalPrice - product.price) * qty : 0;

    return (
        <div className="page" style={{ paddingBottom: 100 }}>
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#555', fontSize: 15, fontWeight: 600, padding: '12px 16px'
                }}
            >
                <FiArrowLeft /> Back
            </button>

            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                gap: 32, padding: '0 16px', maxWidth: 900, margin: '0 auto'
            }}>
                {/* Product Image */}
                <div style={{ position: 'relative' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: 16, objectFit: 'cover', aspectRatio: '1', maxHeight: 380 }}
                    />
                    {product.discount > 0 && (
                        <span style={{
                            position: 'absolute', top: 12, left: 12,
                            background: '#e63946', color: '#fff', padding: '4px 10px',
                            borderRadius: 20, fontSize: 13, fontWeight: 700
                        }}>
                            -{product.discount}% OFF
                        </span>
                    )}
                    <button
                        onClick={() => setLiked(!liked)}
                        style={{
                            position: 'absolute', top: 12, right: 12,
                            background: '#fff', border: 'none', borderRadius: '50%',
                            width: 40, height: 40, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        <FiHeart size={18} style={{ fill: liked ? '#e63946' : 'none', color: liked ? '#e63946' : '#555' }} />
                    </button>
                </div>

                {/* Product Info */}
                <div style={{ padding: '8px 0' }}>
                    {product.badge && (
                        <span style={{
                            background: '#fff3cd', color: '#856404', padding: '3px 10px',
                            borderRadius: 20, fontSize: 12, fontWeight: 700
                        }}>
                            {product.badge}
                        </span>
                    )}

                    <h1 style={{ fontSize: 22, fontWeight: 800, margin: '10px 0 4px', lineHeight: 1.3 }}>
                        {product.name}
                    </h1>
                    <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>{product.unit}</div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Stars rating={product.rating} />
                        <span style={{ color: '#888', fontSize: 13 }}>
                            {product.rating} ({product.reviews.toLocaleString()} reviews)
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: '#e63946' }}>
                            UGX {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span style={{ fontSize: 16, color: '#bbb', textDecoration: 'line-through' }}>
                                UGX {product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {savings > 0 && (
                        <div style={{
                            background: '#d4edda', color: '#155724', padding: '6px 12px',
                            borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 16, display: 'inline-block'
                        }}>
                            🎉 You save UGX {savings.toLocaleString()}
                        </div>
                    )}

                    {/* Description */}
                    <div style={{ margin: '16px 0', lineHeight: 1.8, fontSize: 14, color: '#555' }}>
                        {product.description}
                    </div>

                    {/* Stock */}
                    <div style={{ fontSize: 13, color: product.stock > 10 ? '#2d9e47' : '#e63946', fontWeight: 600, marginBottom: 16 }}>
                        {product.stock > 10 ? `✅ In Stock (${product.stock} available)` : `⚠️ Only ${product.stock} left!`}
                    </div>

                    {/* Quantity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>Quantity:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #e8e8e8', borderRadius: 8 }}>
                            <button
                                onClick={() => setQty(q => Math.max(1, q - 1))}
                                style={{ padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 }}
                            >
                                <FiMinus />
                            </button>
                            <span style={{ padding: '8px 16px', fontWeight: 700, fontSize: 16, borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
                                {qty}
                            </span>
                            <button
                                onClick={() => setQty(q => q + 1)}
                                style={{ padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 }}
                            >
                                <FiPlus />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAdd}
                        style={{
                            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                            background: added ? '#2d9e47' : '#e63946', color: '#fff',
                            fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: 'background .3s',
                            marginBottom: 12
                        }}
                    >
                        {added ? '✓ Added to Cart!' : `Add ${qty > 1 ? `(${qty})` : ''} to Cart — UGX ${(product.price * qty).toLocaleString()}`}
                    </button>

                    {/* Delivery info */}
                    <div style={{
                        background: '#f8f9fa', borderRadius: 10, padding: 14, fontSize: 13, color: '#666'
                    }}>
                        <div>🚚 <strong>Free delivery</strong> on orders above UGX 50,000</div>
                        <div style={{ marginTop: 4 }}>📱 Need help? <strong style={{ color: '#e63946' }}>Order via WhatsApp</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

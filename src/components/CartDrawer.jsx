import { useCart } from '../context/CartContext';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';

export default function CartDrawer() {
    const { items, isOpen, setIsOpen, removeFromCart, updateQty, total, count } = useCart();

    const delivery = total >= 1500 ? 0 : 150;

    return (
        <>
            <div className={`cart-overlay${isOpen ? ' open' : ''}`} onClick={() => setIsOpen(false)} />
            <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Shopping cart">
                <div className="cart-header">
                    <h2 className="cart-title">🛒 My Cart {count > 0 && `(${count})`}</h2>
                    <button className="cart-close" onClick={() => setIsOpen(false)} aria-label="Close cart">
                        <FiX />
                    </button>
                </div>

                <div className="cart-items">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <strong>Your cart is empty</strong>
                            <p style={{ textAlign: 'center', fontSize: '13px', maxWidth: '220px' }}>
                                Add fresh groceries and dry foods to get started!
                            </p>
                            <button
                                style={{ marginTop: 8, padding: '10px 24px', background: '#e63946', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14 }}
                                onClick={() => setIsOpen(false)}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-unit">{item.unit}</div>
                                    <div className="cart-item-price">KSh {(item.price * item.qty).toLocaleString()}</div>
                                    <div className="qty-control">
                                        <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease">
                                            <FiMinus size={12} />
                                        </button>
                                        <span className="qty-num">{item.qty}</span>
                                        <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase">
                                            <FiPlus size={12} />
                                        </button>
                                    </div>
                                </div>
                                <button className="cart-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-subtotal">
                            <span>Subtotal</span>
                            <span>KSh {total.toLocaleString()}</span>
                        </div>
                        <div className="cart-subtotal">
                            <span>Delivery</span>
                            <span style={{ color: delivery === 0 ? '#2d9e47' : 'inherit' }}>
                                {delivery === 0 ? 'FREE 🎉' : `KSh ${delivery}`}
                            </span>
                        </div>
                        {delivery > 0 && (
                            <div style={{ fontSize: 11, color: '#999', marginBottom: 12 }}>
                                Add KSh {(1500 - total).toLocaleString()} more for free delivery
                            </div>
                        )}
                        <div className="cart-total">
                            <span>Total</span>
                            <span>KSh {(total + delivery).toLocaleString()}</span>
                        </div>
                        <button className="checkout-btn">
                            Proceed to Checkout →
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}

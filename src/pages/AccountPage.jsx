import {
    FiUser, FiShoppingBag, FiMapPin, FiHeart,
    FiMessageCircle, FiStar, FiGift
} from 'react-icons/fi';

export default function AccountPage({ onChatOpen }) {
    const options = [
        { icon: <FiShoppingBag />, label: 'My Orders', desc: 'Track and view your past orders' },
        { icon: <FiHeart />, label: 'Saved Items', desc: 'Products you\'ve added to wishlist' },
        { icon: <FiMapPin />, label: 'Delivery Addresses', desc: 'Manage your delivery locations' },
        { icon: <FiStar />, label: 'My Reviews', desc: 'Products you\'ve reviewed' },
        { icon: <FiGift />, label: 'Offers & Vouchers', desc: 'Your available promo codes' },
        { icon: <FiMessageCircle />, label: 'Contact Support', desc: 'Chat or call us on 0702 370 441', action: 'chat' },
    ];

    return (
        <div className="page">
            <div className="page-header">
                <h1>My Account</h1>
                <p>No sign-in required — shop freely!</p>
            </div>

            <div className="account-page">
                <div className="account-icon">👤</div>
                <h2>Welcome, Valued Customer!</h2>
                <p>
                    You can browse and buy without creating an account.
                    All your cart items are saved in this session.
                </p>

                <div style={{
                    background: 'linear-gradient(135deg, #e63946, #c1121f)',
                    borderRadius: 14,
                    padding: '18px 20px',
                    color: '#fff',
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    textAlign: 'left'
                }}>
                    <span style={{ fontSize: 40 }}>🎁</span>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3 }}>Refer a Friend & Earn!</div>
                        <div style={{ fontSize: 13, opacity: .85 }}>
                            Share our number <strong>0702 370 441</strong> — you both get KSh 100 off your next order.
                        </div>
                    </div>
                </div>

                <div className="account-options">
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            className="account-option-btn"
                            onClick={opt.action === 'chat' ? onChatOpen : undefined}
                        >
                            {opt.icon}
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                                <div style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>{opt.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: 24, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
                    📞 Need help? Call or WhatsApp us on <strong style={{ color: '#e63946' }}>0702 370 441</strong>
                </div>
            </div>
        </div>
    );
}

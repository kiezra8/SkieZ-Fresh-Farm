import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    FiHome, FiGrid, FiShoppingBag, FiMessageCircle,
    FiShoppingCart, FiUser, FiSearch
} from 'react-icons/fi';

export default function Navbar({ onChatOpen, activePage }) {
    const { count, setIsOpen } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: <FiHome />, label: 'Home', path: '/' },
        { icon: <FiGrid />, label: 'Categories', path: '/categories' },
        { icon: <FiShoppingBag />, label: 'All Products', path: '/products' },
        { icon: <FiMessageCircle />, label: 'Chat', action: 'chat' },
        { icon: <FiShoppingCart />, label: 'Cart', action: 'cart', badge: count },
        { icon: <FiUser />, label: 'Account', path: '/account' },
    ];

    const handleClick = (item) => {
        if (item.action === 'chat') { onChatOpen(); return; }
        if (item.action === 'cart') { setIsOpen(true); return; }
        if (item.path) navigate(item.path);
    };

    return (
        <>
            <div className="announcement-bar">
                🚚 Free delivery on orders above KSh 1,500 &nbsp;|&nbsp; 🌱 100% Fresh Produce &nbsp;|&nbsp; ⚡ Same Day Delivery Available
            </div>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="nav-logo">
                        <div className="nav-logo-icon">🌿</div>
                        <div className="nav-logo-text">
                            <span>SkieZ</span>
                            <span>Fresh Farm</span>
                        </div>
                    </Link>

                    <div className="nav-search">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search groceries, dry foods..."
                            onKeyDown={e => { if (e.key === 'Enter') navigate('/products'); }}
                        />
                    </div>

                    <div className="nav-links">
                        {navItems.map((item, i) => (
                            <button
                                key={i}
                                className={`nav-link${activePage === item.label ? ' active' : ''}`}
                                onClick={() => handleClick(item)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                            </button>
                        ))}
                    </div>

                    <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* Mobile bottom nav */}
            <nav className="mobile-nav">
                <div className="mobile-nav-items">
                    {navItems.map((item, i) => (
                        <button
                            key={i}
                            className={`mobile-nav-item${activePage === item.label ? ' active' : ''}`}
                            onClick={() => handleClick(item)}
                        >
                            <span style={{ position: 'relative', display: 'inline-block' }}>
                                {item.icon}
                                {item.badge > 0 && (
                                    <span className="nav-badge" style={{ top: -4, right: -6 }}>{item.badge}</span>
                                )}
                            </span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
}

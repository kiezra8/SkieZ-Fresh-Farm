import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <h3>🌿 SkieZ Fresh Farm</h3>
                    <p>
                        Your trusted partner for fresh groceries and quality dry foods.
                        Sourced directly from local farms and delivered with love.
                    </p>
                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                        <a
                            href="https://wa.me/254702370441"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#4ade80', fontWeight: 600, fontSize: 13 }}
                        >
                            📱 WhatsApp
                        </a>
                        <a
                            href="tel:+254702370441"
                            style={{ color: '#aaa', fontWeight: 600, fontSize: 13 }}
                        >
                            📞 0702 370 441
                        </a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/products">All Products</Link>
                    <Link to="/account">My Account</Link>
                </div>

                <div className="footer-col">
                    <h4>Categories</h4>
                    <Link to="/products?category=vegetables">Fresh Vegetables</Link>
                    <Link to="/products?category=fruits">Fresh Fruits</Link>
                    <Link to="/products?category=grains">Rice & Grains</Link>
                    <Link to="/products?category=legumes">Legumes & Beans</Link>
                    <Link to="/products?category=spices">Spices & Herbs</Link>
                </div>

                <div className="footer-col">
                    <h4>Help & Info</h4>
                    <a href="#">Delivery Info</a>
                    <a href="#">Returns Policy</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">FAQ</a>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2024 SkieZ Fresh Farm. All rights reserved.</span>
                <div className="payment-icons">
                    <span>M-Pesa</span> · <span>Cash on Delivery</span> · <span>Visa</span>
                </div>
            </div>
        </footer>
    );
}

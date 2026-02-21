export default function ChatModal({ isOpen, onClose }) {
    const waLink = `https://wa.me/256702370441?text=Hello%20SkieZ%20Fresh%20Farm!%20I%20would%20like%20to%20order%20some%20groceries.`;
    const callLink = `tel:+256702370441`;

    return (
        <>
            <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={onClose}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                    <div className="modal-title">💬 Contact Us</div>
                    <p className="modal-sub">
                        Reach us instantly for orders, questions or custom requests.
                    </p>

                    <a className="contact-option" href={waLink} target="_blank" rel="noopener noreferrer">
                        <div className="contact-icon">
                            <span style={{ fontSize: 26 }}>📱</span>
                        </div>
                        <div className="contact-info">
                            <strong>WhatsApp Us</strong>
                            <span>Quick replies & order tracking</span>
                        </div>
                    </a>

                    <a className="contact-option call" href={callLink}>
                        <div className="contact-icon" style={{ background: '#fee2e2' }}>
                            <span style={{ fontSize: 26 }}>📞</span>
                        </div>
                        <div className="contact-info">
                            <strong>Call Us Now</strong>
                            <span>Mon – Sat, 7am – 8pm</span>
                        </div>
                    </a>

                    <button className="modal-close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

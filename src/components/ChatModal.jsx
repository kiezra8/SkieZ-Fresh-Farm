import { FiX, FiMessageCircle, FiPhoneCall } from 'react-icons/fi';

export default function ChatModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="chat-overlay" onClick={onClose} style={{ zIndex: 5000 }}>
            <div className="chat-panel" onClick={e => e.stopPropagation()} style={{ height: 'auto', paddingBottom: '32px', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                    <button onClick={onClose} className="chat-close-btn" aria-label="Close">
                        <FiX />
                    </button>
                </div>
                
                <div style={{ textAlign: 'center', padding: '0 24px 24px' }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>💬</div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Chat with Us</h2>
                    <p style={{ color: '#666', marginBottom: '32px', lineHeight: '1.5' }}>
                        Have a question about an order or fresh produce availability? Get in touch with us instantly!
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <a 
                            href="https://wa.me/256702370441"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#25D366', color: '#fff', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', transition: 'transform .15s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <FiMessageCircle size={22} />
                            Chat on WhatsApp
                        </a>
                        
                        <a 
                            href="tel:+256702370441"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#e63946', color: '#fff', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', transition: 'transform .15s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <FiPhoneCall size={22} />
                            Call Us Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

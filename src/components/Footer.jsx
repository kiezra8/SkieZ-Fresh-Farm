export default function Footer() {
    return (
        <footer style={{
            background: '#1a1a2e',
            color: '#aaa',
            padding: '20px 16px',
            marginTop: 32
        }}>
            <div style={{
                maxWidth: 1400,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>🌿</span>
                    <div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#fff', fontSize: 15 }}>
                            SkieZ Fresh Farm
                        </div>
                        <div style={{ fontSize: 11, color: '#666' }}>Fresh groceries & dry foods</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                    <a
                        href="https://wa.me/256702370441"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}
                    >
                        📱 WhatsApp
                    </a>
                    <a
                        href="tel:+256702370441"
                        style={{ color: '#aaa', fontWeight: 600, textDecoration: 'none' }}
                    >
                        📞 Call Us
                    </a>
                </div>

                <div style={{ fontSize: 12, color: '#555' }}>
                    © {new Date().getFullYear()} SkieZ Fresh Farm. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

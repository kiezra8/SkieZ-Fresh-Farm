import { tickerItems } from '../data/products';

export default function FlashTicker() {
    const doubled = [...tickerItems, ...tickerItems];

    return (
        <div className="flash-ticker" role="marquee" aria-label="Flash sale items">
            <div className="flash-label">
                <span>⚡</span>
                <span>FLASH DEALS</span>
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
                <div className="ticker-track">
                    {doubled.map((item, i) => (
                        <div key={i} className="ticker-item">
                            {item.text} — <span>{item.price}</span>{' '}
                            <span style={{ textDecoration: 'line-through', color: '#666', fontSize: '11px' }}>
                                {item.original}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

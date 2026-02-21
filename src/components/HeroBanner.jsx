import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/products';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % heroSlides.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    const prev = () => setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length);
    const next = () => setCurrent(c => (c + 1) % heroSlides.length);

    return (
        <section className="hero-section">
            <div className="hero-slider">
                {heroSlides.map((slide, i) => (
                    <div
                        key={slide.id}
                        className={`hero-slide${i === current ? ' active' : ''}`}
                        style={{ backgroundImage: `url(${slide.bg})` }}
                    >
                        <div className="hero-overlay">
                            <div className="hero-content">
                                <span className="hero-tag">{slide.tag}</span>
                                <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
                                <p className="hero-subtitle">{slide.subtitle}</p>
                                <Link to="/products" className="hero-btn">
                                    {slide.cta} <FiArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="slider-arrow left" onClick={prev} aria-label="Previous">
                    <FiChevronLeft />
                </button>
                <button className="slider-arrow right" onClick={next} aria-label="Next">
                    <FiChevronRight />
                </button>

                <div className="slider-dots">
                    {heroSlides.map((_, i) => (
                        <button
                            key={i}
                            className={`slider-dot${i === current ? ' active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* 3 promo banners */}
            <div className="promo-banners">
                <div className="promo-banner">
                    <span className="promo-icon">🚚</span>
                    <div className="promo-text">
                        <strong>Free Same-Day Delivery</strong>
                        <span>On orders above KSh 1,500</span>
                    </div>
                </div>
                <div className="promo-banner">
                    <span className="promo-icon">🌿</span>
                    <div className="promo-text">
                        <strong>100% Farm Fresh</strong>
                        <span>Sourced directly from local farms</span>
                    </div>
                </div>
                <div className="promo-banner">
                    <span className="promo-icon">💰</span>
                    <div className="promo-text">
                        <strong>Best Prices Guaranteed</strong>
                        <span>We match any lower market price</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

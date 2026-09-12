import React from 'react';

const BookPwaniLogo = ({ size = 'md', showText = true, className = '' }) => {
    // Dimension configurations
    const dimensions = {
        sm: { iconSize: 32, fontSize: '1.15rem', subSize: '0.6rem' },
        md: { iconSize: 42, fontSize: '1.45rem', subSize: '0.68rem' },
        lg: { iconSize: 56, fontSize: '1.9rem', subSize: '0.8rem' }
    };

    const config = dimensions[size] || dimensions.md;

    return (
        <div className={`bookpwani-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            {/* Custom SVG Coastal Brand Mark */}
            <div
                className="logo-mark-container"
                style={{
                    width: `${config.iconSize}px`,
                    height: `${config.iconSize}px`,
                    flexShrink: 0,
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0f172a 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'block' }}
                >
                    <defs>
                        {/* Sun Gradient */}
                        <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ffedd5" />
                            <stop offset="40%" stopColor="#fb923c" />
                            <stop offset="100%" stopColor="#ff0050" />
                        </linearGradient>

                        {/* Wave Gradient */}
                        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#00f2ea" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>

                        {/* Sail Gradient */}
                        <linearGradient id="sailGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#e0f2fe" />
                        </linearGradient>
                    </defs>

                    {/* Coastal Horizon Sun */}
                    <circle cx="31" cy="16" r="7.5" fill="url(#sunGrad)" opacity="0.95" />

                    {/* Traditional Swahili Dhow Lateen Sail */}
                    <path
                        d="M 14 33 C 16 20, 23 11, 28 8 C 26.5 19, 24.5 27.5, 23 33 Z"
                        fill="url(#sailGrad)"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                    />

                    {/* Secondary Jib Sail (Coral Accent) */}
                    <path
                        d="M 25 12 C 29.5 16, 33 22, 34 32 C 29.5 31.5, 26 28.5, 24.5 24 Z"
                        fill="url(#sunGrad)"
                        opacity="0.88"
                    />

                    {/* Ocean Wave Sweeps */}
                    <path
                        d="M 7 35 C 13 31, 18 37, 24 33 C 30 29, 35 34, 41 32 C 43 36, 40 40, 34 40 C 24 40, 16 40, 7 35 Z"
                        fill="url(#waveGrad)"
                    />
                    <path
                        d="M 10 37 C 16 34, 21 39, 27 36 C 33 33, 37 36, 40 35 C 38 41, 30 42, 22 42 C 14 42, 8 40, 10 37 Z"
                        fill="#0284c7"
                        opacity="0.6"
                    />
                </svg>
            </div>

            {/* Typography */}
            {showText && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                    <div style={{ fontSize: config.fontSize, fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <span style={{ color: '#0f172a' }}>book</span>
                        <span style={{
                            background: 'linear-gradient(135deg, #0284c7 0%, #ff0050 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Pwani
                        </span>
                    </div>
                    <span style={{
                        fontSize: config.subSize,
                        color: '#64748b',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px'
                    }}>
                        Coastal Kenya Tourism
                    </span>
                </div>
            )}
        </div>
    );
};

export default BookPwaniLogo;

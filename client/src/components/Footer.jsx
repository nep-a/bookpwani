import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem 1rem',
            borderTop: '1px solid #e9ecef',
            marginTop: 'auto',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/" style={{ color: '#495057', textDecoration: 'none' }}>Home</Link>
                </div>
                <p style={{ color: '#6c757d', margin: 0, fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} VisitTour. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

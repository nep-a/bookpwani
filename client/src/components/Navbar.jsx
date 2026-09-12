import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaPlus,
    FaSignOutAlt,
    FaCalendarCheck,
    FaBars,
    FaTimes,
    FaUser,
    FaShieldAlt,
    FaUserTie,
    FaSearch,
    FaCompass,
    FaTachometerAlt
} from 'react-icons/fa';
import BookPwaniLogo from './BookPwaniLogo';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);

    // Sync search input with URL ?q= param
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchValue(params.get('q') || '');
    }, [location.search]);

    // Auto close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/login');
    };

    const handleLinkClick = () => setMobileOpen(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = searchValue.trim();
        // Navigate to home with search query param
        navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
        setMobileOpen(false);
    };

    const handleSearchClear = () => {
        setSearchValue('');
        navigate('/');
        searchRef.current?.focus();
    };

    return (
        <nav className="navbar-fixed">
            <div className="nav-container">

                {/* ── Brand Logo ── */}
                <Link
                    to="/"
                    className="brand-logo"
                    onClick={handleLinkClick}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                    <BookPwaniLogo size="md" />
                </Link>

                {/* ── Centre: Search Bar (desktop) ── */}
                <form
                    className="nav-search-form desktop-only"
                    onSubmit={handleSearchSubmit}
                    role="search"
                    aria-label="Search experiences"
                >
                    <div className="nav-search-wrap">
                        <FaSearch className="nav-search-icon" />
                        <input
                            ref={searchRef}
                            type="search"
                            className="nav-search-input"
                            placeholder="Search experiences, dhows, safaris…"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            aria-label="Search experiences"
                        />
                        {searchValue && (
                            <button
                                type="button"
                                className="nav-search-clear"
                                onClick={handleSearchClear}
                                aria-label="Clear search"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    <button type="submit" className="nav-search-btn">
                        Explore
                    </button>
                </form>

                {/* ── Right: Actions ── */}
                <div className="nav-actions desktop-only">
                    {user ? (
                        <>
                            {/* My Bookings — traveler */}
                            {user.role === 'traveler' && (
                                <Link to="/my-bookings" className="nav-action-link">
                                    <FaCalendarCheck />
                                    <span>My Bookings</span>
                                </Link>
                            )}

                            {/* Host links */}
                            {user.role === 'host' && (
                                <>
                                    <Link to="/dashboard" className="nav-action-link">
                                        <FaTachometerAlt />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/create-event" className="btn btn-primary btn-sm">
                                        <FaPlus /> Post
                                    </Link>
                                </>
                            )}

                            {/* Admin */}
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-action-link admin-link">
                                    <FaShieldAlt />
                                    <span>Admin</span>
                                </Link>
                            )}

                            {/* Avatar + logout */}
                            <div className="nav-user-item">
                                <Link to="/profile" className="nav-profile-link">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="nav-avatar" />
                                    ) : (
                                        <div className="host-avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <span className="nav-username">{user.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="btn-icon-nav" title="Log Out">
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-action-link">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>

                {/* ── Mobile Hamburger ── */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            {mobileOpen && (
                <>
                    <div className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} />
                    <div className="mobile-nav-drawer">
                        <div className="mobile-nav-content">

                            {/* Mobile Search */}
                            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
                                <div className="mobile-search-wrap">
                                    <FaSearch className="mobile-search-icon" />
                                    <input
                                        type="search"
                                        className="mobile-search-input"
                                        placeholder="Search experiences…"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        aria-label="Search experiences"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
                                    <FaSearch />
                                </button>
                            </form>

                            {/* User card when logged in */}
                            {user && (
                                <div className="mobile-user-card">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="mobile-user-avatar" />
                                    ) : (
                                        <div className="host-avatar-placeholder" style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}>
                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="mobile-user-info">
                                        <strong>{user.username}</strong>
                                    </div>
                                </div>
                            )}

                            <div className="mobile-nav-links">
                                <Link to="/" className="mobile-nav-item" onClick={handleLinkClick}>
                                    <FaCompass /> Explore Coast
                                </Link>

                                {user ? (
                                    <>
                                        {user.role === 'traveler' && (
                                            <Link to="/my-bookings" className="mobile-nav-item" onClick={handleLinkClick}>
                                                <FaCalendarCheck /> My Bookings
                                            </Link>
                                        )}

                                        {user.role === 'host' && (
                                            <>
                                                <Link to="/create-event" className="mobile-nav-item highlight-btn" onClick={handleLinkClick}>
                                                    <FaPlus /> Post Experience
                                                </Link>
                                                <Link to="/dashboard" className="mobile-nav-item" onClick={handleLinkClick}>
                                                    <FaUserTie /> Host Dashboard
                                                </Link>
                                            </>
                                        )}

                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="mobile-nav-item admin-item" onClick={handleLinkClick}>
                                                <FaShieldAlt /> Admin Panel
                                            </Link>
                                        )}

                                        <Link to="/profile" className="mobile-nav-item" onClick={handleLinkClick}>
                                            <FaUser /> Account Profile
                                        </Link>

                                        <button onClick={handleLogout} className="mobile-logout-btn">
                                            <FaSignOutAlt /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="mobile-auth-actions">
                                        <Link to="/login" className="btn btn-secondary" onClick={handleLinkClick} style={{ width: '100%' }}>
                                            Login
                                        </Link>
                                        <Link to="/register" className="btn btn-primary" onClick={handleLinkClick} style={{ width: '100%' }}>
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;

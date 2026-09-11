import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import BookingModal from '../components/BookingModal';
import EventDetailsModal from '../components/EventDetailsModal';
import { eventService, COASTAL_CATEGORIES } from '../services/eventService';
import {
    FaLandmark,
    FaUtensils,
    FaHotel,
    FaUmbrellaBeach,
    FaPaw,
    FaCompass,
    FaWater,
    FaTicketAlt,
    FaStar
} from 'react-icons/fa';

const CATEGORY_ICONS = {
    'all': <FaCompass />,
    'Culture': <FaLandmark />,
    'Food': <FaUtensils />,
    'Stays': <FaHotel />,
    'Beach': <FaUmbrellaBeach />,
    'Safaris': <FaPaw />
};

const Home = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
    const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        search: searchParams.get('q') || '',
        category: 'all',
    });

    const [loading, setLoading] = useState(false);

    // Sync search filter whenever URL ?q= changes (typed from Navbar)
    useEffect(() => {
        const q = searchParams.get('q') || '';
        setFilters(prev => ({ ...prev, search: q }));
    }, [searchParams]);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await eventService.getEvents(filters);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching coastal experiences:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleReset = () => {
        navigate('/');
        setFilters({ search: '', category: 'all' });
    };

    const handleCategoryClick = (catId) => {
        setFilters(prev => ({ ...prev, category: catId }));
    };

    const handleBookClick = (event) => {
        if (!user) {
            if (confirm('Please sign in or create a free account to book. Go to Login?')) {
                navigate('/login');
            }
            return;
        }
        setSelectedEventForBooking(event);
    };

    const featuredEvents = events.filter(e => e.featured);
    const isFiltered = filters.search || filters.category !== 'all';

    return (
        <div className="home-event-page">
            <div className="container" style={{ paddingTop: '90px', paddingBottom: '70px' }}>

                {/* ── Category Chips ── */}
                <div className="categories-filter-wrapper">
                    <div className="categories-header-row">
                        <div>
                            <h3>Browse by Category</h3>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                Culture · Food · Stays · Beach · Safaris
                            </span>

                        </div>
                        <span className="results-counter">
                            {loading ? '…' : `${events.length} experience${events.length !== 1 ? 's' : ''}`}
                        </span>
                    </div>

                    <div className="categories-chips-scroll">
                        {COASTAL_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-chip ${filters.category === cat.id ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                <span className="chip-icon">{CATEGORY_ICONS[cat.id] || <FaWater />}</span>
                                <span className="chip-label">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Active Search Banner ── */}
                {filters.search && (
                    <div className="active-search-banner">
                        <FaCompass style={{ color: '#0284c7' }} />
                        <span>Results for <strong>"{filters.search}"</strong></span>
                        <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                            <FaRedo /> Clear
                        </button>
                    </div>
                )}

                {/* ── Featured Experiences ── */}
                {!isFiltered && featuredEvents.length > 0 && (
                    <div className="featured-section">
                        <div className="section-title-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaStar style={{ color: '#ff0050' }} />
                                <h3>Featured Coastal Experiences</h3>
                            </div>
                            <span className="badge" style={{ background: '#ff0050', color: 'white' }}>Top Rated</span>
                        </div>
                        <div className="events-grid">
                            {featuredEvents.slice(0, 2).map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onBook={handleBookClick}
                                    onSelectDetails={setSelectedEventForDetails}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── All Events Grid ── */}
                <div className="all-events-section" style={{ marginTop: '30px' }}>
                    <div className="section-title-row">
                        <h3>
                            {filters.category === 'all' ? 'All Coastal Experiences' : `${filters.category} Experiences`}
                        </h3>
                    </div>

                    {loading ? (
                        <div className="empty-state-card">
                            <p>Loading coastal experiences…</p>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="events-grid">
                            {events.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onBook={handleBookClick}
                                    onSelectDetails={setSelectedEventForDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-card">
                            <div className="empty-icon-box"><FaTicketAlt /></div>
                            <h3>No Experiences Found</h3>
                            <p>Try a different category, destination, or clear your search.</p>
                            <button className="btn btn-primary" onClick={handleReset} style={{ marginTop: '15px' }}>
                                View All Experiences
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Booking Modal ── */}
            {selectedEventForBooking && (
                <BookingModal
                    event={selectedEventForBooking}
                    onClose={() => setSelectedEventForBooking(null)}
                    onBookingCompleted={() => fetchEvents()}
                />
            )}

            {/* ── Event Details Modal ── */}
            {selectedEventForDetails && (
                <EventDetailsModal
                    event={selectedEventForDetails}
                    onClose={() => setSelectedEventForDetails(null)}
                    onBook={handleBookClick}
                />
            )}
        </div>
    );
};

export default Home;

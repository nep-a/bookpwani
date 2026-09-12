import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import EventDetailsModal from '../components/EventDetailsModal';
import BookingModal from '../components/BookingModal';
import { FaMapMarkerAlt, FaStar, FaWater, FaTree, FaMusic, FaUtensils, FaRedo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const COASTAL_CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'Culture', name: 'Culture & Heritage' },
    { id: 'Water Sports', name: 'Water Sports' },
    { id: 'Safaris', name: 'Coastal Safaris' },
    { id: 'Food', name: 'Swahili Cuisine' },
    { id: 'Nightlife', name: 'Nightlife & Beach Clubs' }
];

const CATEGORY_ICONS = {
    'Culture': <FaStar />,
    'Water Sports': <FaWater />,
    'Safaris': <FaTree />,
    'Food': <FaUtensils />,
    'Nightlife': <FaMusic />
};

const FeaturedCarousel = ({ events, onBook, onSelectDetails }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (events.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 5000); // 5 seconds auto-slide
        return () => clearInterval(timer);
    }, [events.length]);

    if (!events || events.length === 0) return null;

    const event = events[currentIndex];

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % events.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);

    return (
        <div className="featured-carousel-container" style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div className="carousel-slides" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div 
                    key={event.id}
                    className="carousel-slide active" 
                    style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: `url(${event.image || ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                >
                    <div className="carousel-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%)' }}></div>
                    
                    {/* Top Badge */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                        <span className="badge" style={{ background: '#ff0050', color: 'white', padding: '8px 16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaStar /> Featured Experience
                        </span>
                    </div>

                    <div className="carousel-content" style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px', zIndex: 10, color: 'white' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', color: 'white' }}>{event.category}</span>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', color: 'white' }}><FaMapMarkerAlt /> {event.venue || event.location}</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 10px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{event.title}</h2>
                        <p style={{ fontSize: '1.1rem', margin: '0 0 20px 0', maxWidth: '600px', opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                        
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }} onClick={() => onBook(event)}>
                                Book from Ksh {Number(event.price).toLocaleString()}
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => onSelectDetails(event)}>
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {events.length > 1 && (
                <>
                    <button onClick={handlePrev} className="carousel-control prev" style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}>
                        <FaChevronLeft />
                    </button>
                    <button onClick={handleNext} className="carousel-control next" style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}>
                        <FaChevronRight />
                    </button>
                    
                    <div className="carousel-indicators" style={{ position: 'absolute', bottom: '20px', right: '30px', display: 'flex', gap: '8px', zIndex: 20 }}>
                        {events.map((_, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setCurrentIndex(idx)}
                                style={{ 
                                    width: idx === currentIndex ? '24px' : '8px', 
                                    height: '8px', 
                                    borderRadius: '4px', 
                                    background: idx === currentIndex ? '#ff0050' : 'rgba(255,255,255,0.5)', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }} 
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const Home = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', category: 'all' });
    
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('q') || '';
        setFilters(prev => ({ ...prev, search: query }));
    }, [location.search]);

    const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
    const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            let data = [];
            try {
                const res = await fetch('http://localhost:5000/api/traveler/events');
                if (res.ok) {
                    const json = await res.json();
                    data = json.events;
                }
            } catch (err) {
                data = await eventService.getAllEvents();
            }
            setEvents(data || []);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setFilters(prev => ({ ...prev, category: categoryId }));
    };

    const handleBookClick = (event) => {
        if (!user) {
            alert('Please login to book tickets!');
            return;
        }
        setSelectedEventForBooking(event);
    };

    const filteredEvents = events.filter(e => {
        if (filters.category !== 'all' && e.category !== filters.category) return false;
        if (filters.search && !e.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const featuredEvents = events.filter(e => e.featured);
    const isFiltered = filters.search || filters.category !== 'all';

    return (
        <div className="home-event-page">
            <div className="container" style={{ paddingTop: '90px', paddingBottom: '70px' }}>

                {/* Categories Filter */}
                <div className="categories-filter-wrapper">
                    <div className="categories-header-row">
                        <div>
                            <h3>Browse by Category</h3>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                Culture • Food • Stays • Beach • Safaris
                            </span>
                        </div>
                        <span className="results-counter">
                            {loading ? '...' : `${filteredEvents.length} experience${filteredEvents.length !== 1 ? 's' : ''}`}
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

                {/* Featured Carousel */}
                {!isFiltered && featuredEvents.length > 0 && (
                    <FeaturedCarousel 
                        events={featuredEvents} 
                        onBook={handleBookClick}
                        onSelectDetails={setSelectedEventForDetails}
                    />
                )}

                {/* All Events Grid */}
                <div className="all-events-section" style={{ marginTop: isFiltered ? '20px' : '0' }}>
                    <div className="section-title-row">
                        <h3>
                            {filters.category === 'all' ? 'All Coastal Experiences' : `${COASTAL_CATEGORIES.find(c => c.id === filters.category)?.name || ''} Experiences`}
                        </h3>
                    </div>

                    {loading ? (
                        <div className="empty-state-card">
                            <p>Loading coastal experiences...</p>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="events-grid">
                            {filteredEvents.map(event => (
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
                            <div className="empty-icon-box" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                                <FaMapMarkerAlt />
                            </div>
                            <h3>No experiences found</h3>
                            <p>Try selecting a different category or clearing your filters.</p>
                            <button className="btn btn-secondary" onClick={() => setFilters({ search: '', category: 'all' })} style={{ marginTop: '15px' }}>
                                <FaRedo /> Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {selectedEventForDetails && (
                <EventDetailsModal
                    event={selectedEventForDetails}
                    onClose={() => setSelectedEventForDetails(null)}
                    onBook={() => {
                        setSelectedEventForDetails(null);
                        handleBookClick(selectedEventForDetails);
                    }}
                />
            )}

            {selectedEventForBooking && (
                <BookingModal
                    event={selectedEventForBooking}
                    onClose={() => setSelectedEventForBooking(null)}
                    onBookingCompleted={(booking) => {
                        setSelectedEventForBooking(null);
                    }}
                />
            )}
        </div>
    );
};

export default Home;

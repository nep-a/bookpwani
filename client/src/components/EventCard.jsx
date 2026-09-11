import { useState, useEffect, useContext } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaHeart, FaShareAlt, FaTicketAlt, FaCheckCircle, FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventService } from '../services/eventService';

const EventCard = ({ event, onBook, onSelectDetails }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(event.likesCount || 0);

    useEffect(() => {
        if (user) {
            eventService.isLiked(event.id, user.id).then(setLiked);
        }
    }, [event.id, user]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) {
            showNotification('Please sign in to save events', 'info');
            return;
        }
        try {
            const res = await eventService.toggleLike(event.id, user.id);
            setLiked(res.liked);
            setLikesCount(res.count);
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: `Check out ${event.title} happening at ${event.venue}!`,
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            showNotification('Event link copied to clipboard!', 'success');
        }
    };

    // Format date badge (e.g. "OCT 24")
    const dateObj = new Date(event.startDate || Date.now());
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = dateObj.getDate();

    // Total available tickets across all tiers
    const totalAvailable = event.ticketTiers?.reduce((acc, t) => acc + (t.available || 0), 0) || 0;
    const isSoldOut = totalAvailable <= 0;

    return (
        <div className="event-card glass-panel" onClick={() => onSelectDetails && onSelectDetails(event)}>
            {/* Poster Header */}
            <div className="event-card-media">
                <img src={event.image} alt={event.title} className="event-card-img" />
                <div className="event-card-overlay" />

                {/* Date Tag Badge */}
                <div className="event-date-badge">
                    <span className="event-date-month">{month}</span>
                    <span className="event-date-day">{day}</span>
                </div>

                {/* Category Chip */}
                <div className="event-category-chip">
                    <FaTag style={{ fontSize: '0.75rem' }} />
                    <span>{event.category}</span>
                </div>

                {/* Quick Action Floating Controls */}
                <div className="event-card-top-actions">
                    <button
                        className={`event-icon-btn ${liked ? 'active' : ''}`}
                        onClick={handleLike}
                        title={liked ? 'Saved to favorites' : 'Save event'}
                    >
                        <FaHeart />
                    </button>
                    <button
                        className="event-icon-btn"
                        onClick={handleShare}
                        title="Share event"
                    >
                        <FaShareAlt />
                    </button>
                </div>
            </div>

            {/* Event Body Details */}
            <div className="event-card-content">
                <div className="event-organizer-row">
                    <img
                        src={event.organizer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={event.organizer?.username}
                        className="event-organizer-avatar"
                    />
                    <span className="event-organizer-name">
                        {event.organizer?.username || 'Verified Organizer'}
                    </span>
                    {event.organizer?.verified && (
                        <FaCheckCircle style={{ color: '#3182ce', fontSize: '0.85rem' }} title="Verified Host" />
                    )}
                </div>

                <h3 className="event-title" title={event.title}>{event.title}</h3>

                <div className="event-meta-row">
                    <div className="event-meta-item">
                        <FaCalendarAlt className="event-meta-icon" />
                        <span>{event.startDate} • {event.time || 'TBA'}</span>
                    </div>
                    <div className="event-meta-item">
                        <FaMapMarkerAlt className="event-meta-icon" />
                        <span className="event-venue-text">{event.venue || event.location}</span>
                    </div>
                </div>

                <p className="event-card-desc">
                    {event.description?.slice(0, 110)}...
                </p>

                {/* Card Footer: Price & Ticket Action */}
                <div className="event-card-footer">
                    <div className="event-price-block">
                        <span className="event-price-label">Tickets from</span>
                        <span className="event-price-val">Ksh {Number(event.price).toLocaleString()}</span>
                    </div>

                    <button
                        className={`btn btn-primary ${isSoldOut ? 'disabled' : ''}`}
                        disabled={isSoldOut}
                        onClick={(e) => {
                            e.stopPropagation();
                            onBook(event);
                        }}
                    >
                        <FaTicketAlt /> {isSoldOut ? 'Sold Out' : 'Book Tickets'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;

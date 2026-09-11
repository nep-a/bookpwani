import React from 'react';
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaTicketAlt, FaCheckCircle, FaStar, FaShareAlt } from 'react-icons/fa';

const EventDetailsModal = ({ event, onClose, onBook }) => {
    if (!event) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content event-details-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close modal">
                    <FaTimes />
                </button>

                {/* Hero Header */}
                <div className="event-details-hero">
                    <img src={event.image} alt={event.title} className="event-details-hero-img" />
                    <div className="event-details-hero-grad" />
                    <div className="event-details-hero-meta">
                        <span className="event-category-chip">
                            <FaTag style={{ fontSize: '0.75rem' }} /> {event.category}
                        </span>
                        <h2>{event.title}</h2>
                        <div className="event-details-loc-date">
                            <span><FaCalendarAlt /> {event.startDate} • {event.time || 'TBA'}</span>
                            <span><FaMapMarkerAlt /> {event.venue || event.location}</span>
                        </div>
                    </div>
                </div>

                <div className="event-details-body">
                    {/* Organizer Section */}
                    <div className="event-details-organizer-box">
                        <img
                            src={event.organizer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={event.organizer?.username}
                            className="event-organizer-avatar large"
                        />
                        <div className="organizer-text">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong>{event.organizer?.username || 'Verified Organizer'}</strong>
                                {event.organizer?.verified && <FaCheckCircle style={{ color: '#3182ce' }} />}
                            </div>
                            <span>Event Organizer & Host</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="event-details-section">
                        <h4>About This Experience</h4>
                        <p style={{ lineHeight: '1.6', color: '#4a5568' }}>{event.description}</p>
                    </div>

                    {/* Ticket Tiers Available */}
                    <div className="event-details-section">
                        <h4>Ticket Categories</h4>
                        <div className="event-tiers-overview">
                            {event.ticketTiers?.map(tier => (
                                <div key={tier.id} className="tier-overview-card">
                                    <div className="tier-overview-header">
                                        <span className="tier-name">{tier.name}</span>
                                        <span className="tier-price">Ksh {Number(tier.price).toLocaleString()}</span>
                                    </div>
                                    <div className="tier-overview-perks">
                                        {tier.perks?.map((perk, i) => (
                                            <span key={i} className="perk-badge"><FaCheckCircle /> {perk}</span>
                                        ))}
                                    </div>
                                    <span className="tier-remaining">
                                        {(tier.available ?? 0) > 0 ? `${tier.available} spots left` : 'Sold Out'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="event-tags-row">
                            {event.tags.map((tag, i) => (
                                <span key={i} className="event-tag-pill">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sticky Action Footer */}
                <div className="event-details-footer">
                    <div className="footer-price-info">
                        <span style={{ fontSize: '0.8rem', color: '#718096' }}>Starting from</span>
                        <strong style={{ fontSize: '1.3rem', color: 'var(--primary-color)' }}>
                            Ksh {Number(event.price).toLocaleString()}
                        </strong>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Back to Events
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                onClose();
                                onBook(event);
                            }}
                        >
                            <FaTicketAlt /> Book Tickets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;

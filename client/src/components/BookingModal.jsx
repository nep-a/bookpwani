import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventService } from '../services/eventService';
import { FaTimes, FaTicketAlt, FaCheckCircle, FaMobileAlt, FaUser, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import TicketPassModal from './TicketPassModal';

const BookingModal = ({ event, reel, onClose, onBookingCompleted }) => {
    // Support either prop name
    const activeEvent = event || reel;
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    const tiers = activeEvent?.ticketTiers || [
        { id: 'tier_reg', name: 'General Admission', price: activeEvent?.price || 1500, available: 50, perks: ['Entry pass'] }
    ];

    const [selectedTierId, setSelectedTierId] = useState(tiers[0]?.id || '');
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone_number || '');
    const [specialRequests, setSpecialRequests] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    if (!activeEvent) return null;

    const selectedTier = tiers.find(t => t.id === selectedTierId) || tiers[0];
    const subtotal = (selectedTier?.price || activeEvent.price || 0) * quantity;

    const handleQuantityChange = (delta) => {
        const next = quantity + delta;
        if (next >= 1 && next <= Math.min(10, selectedTier?.available || 10)) {
            setQuantity(next);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            showNotification('Please log in to complete your booking', 'info');
            return;
        }

        if (!phone) {
            showNotification('Please provide a phone / M-Pesa number', 'error');
            return;
        }

        setLoading(true);
        try {
            const booking = await eventService.bookTickets({
                eventId: activeEvent.id,
                ticketTierId: selectedTier.id,
                quantity,
                attendeeName: name,
                attendeeEmail: email,
                attendeePhone: phone,
                specialRequests,
                user
            });

            showNotification(`Tickets booked! Booking ref: ${booking.ticketCode}`, 'success');
            setConfirmedBooking(booking);
            if (onBookingCompleted) {
                onBookingCompleted(booking);
            }
        } catch (error) {
            showNotification(error.message || 'Booking failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (confirmedBooking) {
        return (
            <TicketPassModal
                booking={confirmedBooking}
                onClose={() => {
                    setConfirmedBooking(null);
                    onClose();
                }}
            />
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content booking-checkout-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close modal">
                    <FaTimes />
                </button>

                {/* Header with Event Summary */}
                <div className="checkout-header">
                    <div className="checkout-event-meta">
                        <span className="checkout-badge">{activeEvent.category}</span>
                        <h2>{activeEvent.title}</h2>
                        <div className="checkout-location-time">
                            <span><FaCalendarAlt /> {activeEvent.startDate} • {activeEvent.time || 'TBA'}</span>
                            <span><FaMapMarkerAlt /> {activeEvent.venue || activeEvent.location}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleBooking} className="checkout-form">
                    {/* Step 1: Select Ticket Tier */}
                    <div className="checkout-section">
                        <label className="section-label"><FaTicketAlt /> Select Ticket Category</label>
                        <div className="tier-options-list">
                            {tiers.map(tier => {
                                const isSelected = tier.id === selectedTierId;
                                const isAvailable = (tier.available ?? 1) > 0;

                                return (
                                    <div
                                        key={tier.id}
                                        className={`tier-card-option ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                                        onClick={() => isAvailable && setSelectedTierId(tier.id)}
                                    >
                                        <div className="tier-info">
                                            <span className="tier-name">{tier.name}</span>
                                            {tier.perks && (
                                                <span className="tier-perks">{tier.perks.join(' • ')}</span>
                                            )}
                                            <span className="tier-stock-hint">
                                                {isAvailable ? `${tier.available} tickets available` : 'Sold out'}
                                            </span>
                                        </div>
                                        <div className="tier-price-tag">
                                            Ksh {Number(tier.price).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Quantity Counter */}
                    <div className="checkout-section quantity-row">
                        <div>
                            <label className="section-label" style={{ marginBottom: '2px' }}>Number of Tickets</label>
                            <span style={{ fontSize: '0.8rem', color: '#718096' }}>Max 10 per booking</span>
                        </div>
                        <div className="quantity-counter">
                            <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= (selectedTier?.available || 10)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Step 3: Attendee Details */}
                    <div className="checkout-section">
                        <label className="section-label"><FaUser /> Attendee Information</label>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>M-Pesa / Phone</label>
                                <input
                                    type="tel"
                                    placeholder="0712 345 678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirmation Email</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Special Requests (Optional)</label>
                            <input
                                type="text"
                                placeholder="Accessibility, dietary preferences, seating notes"
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Total Summary & Checkout Button */}
                    <div className="checkout-summary-footer">
                        <div className="checkout-total-block">
                            <span className="summary-label">Total Amount</span>
                            <span className="summary-price">Ksh {subtotal.toLocaleString()}</span>
                            <span className="summary-breakdown">{quantity} × Ksh {selectedTier?.price?.toLocaleString()}</span>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-checkout-action"
                            disabled={loading || (selectedTier?.available || 0) <= 0}
                        >
                            {loading ? 'Processing Pass...' : (
                                <>
                                    <FaMobileAlt /> Confirm & Issue Pass
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;

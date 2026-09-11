import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventService } from '../services/eventService';
import TicketPassModal from '../components/TicketPassModal';
import ReviewModal from '../components/ReviewModal';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaTimesCircle, FaCheck, FaTrash, FaQrcode, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [bookings, setBookings] = useState([]);
    const [selectedTicketForPass, setSelectedTicketForPass] = useState(null);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchBookings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await eventService.getMyBookings(user.id);
            setBookings(data);
        } catch (error) {
            console.error('Error loading tickets:', error);
            showNotification('Failed to fetch tickets', 'error');
        } finally {
            setLoading(false);
        }
    }, [user, showNotification]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCancelClick = (booking) => {
        setBookingToCancel(booking);
        setShowCancelModal(true);
    };

    const handleCancelConfirm = async () => {
        if (!bookingToCancel) return;
        try {
            await eventService.cancelBooking(bookingToCancel.id);
            showNotification('Ticket booking cancelled', 'info');
            setShowCancelModal(false);
            setBookingToCancel(null);
            fetchBookings();
        } catch (error) {
            showNotification(error.message || 'Failed to cancel', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this cancelled ticket from your history?')) return;
        try {
            await eventService.deleteBooking(id);
            showNotification('Ticket record removed', 'success');
            fetchBookings();
        } catch (error) {
            showNotification('Failed to remove record', 'error');
        }
    };

    return (
        <div className="container" style={{ marginTop: '100px', paddingBottom: '60px' }}>
            <div className="bookings-header-block">
                <div>
                    <h2>My Event Passes & Bookings</h2>
                    <p style={{ color: '#718096' }}>View your confirmed passes, download QR check-in codes, and manage bookings.</p>
                </div>
                <Link to="/" className="btn btn-primary btn-sm">
                    <FaTicketAlt /> Explore More Events
                </Link>
            </div>

            <div className="glass-panel" style={{ marginTop: '20px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '30px' }}>Loading your tickets...</p>
                ) : bookings.length === 0 ? (
                    <div className="empty-state-card" style={{ padding: '40px 20px' }}>
                        <div className="empty-icon-box">
                            <FaTicketAlt />
                        </div>
                        <h3>No Bookings Found</h3>
                        <p>You haven't booked any event passes yet. Browse upcoming music festivals, conferences & safaris!</p>
                        <Link to="/" className="btn btn-primary" style={{ marginTop: '15px' }}>
                            Browse Available Events
                        </Link>
                    </div>
                ) : (
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                    <th style={{ padding: '14px 10px' }}>Event</th>
                                    <th style={{ padding: '14px 10px' }}>Date & Venue</th>
                                    <th style={{ padding: '14px 10px' }}>Pass Category</th>
                                    <th style={{ padding: '14px 10px' }}>Qty</th>
                                    <th style={{ padding: '14px 10px' }}>Total Paid</th>
                                    <th style={{ padding: '14px 10px' }}>Status</th>
                                    <th style={{ padding: '14px 10px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <td style={{ padding: '14px 10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {booking.eventImage && (
                                                    <img
                                                        src={booking.eventImage}
                                                        alt={booking.eventTitle}
                                                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <div>
                                                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{booking.eventTitle}</strong>
                                                    <span style={{ fontSize: '0.8rem', color: '#718096' }}>Ref: {booking.ticketCode}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 10px' }}>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <div><FaCalendarAlt style={{ color: 'var(--primary-color)' }} /> {booking.eventDate}</div>
                                                <div style={{ color: '#718096', fontSize: '0.8rem' }}><FaMapMarkerAlt /> {booking.eventVenue}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 10px' }}>
                                            <span className="badge" style={{ background: '#edf2f7', color: '#2d3748', border: 'none' }}>
                                                {booking.ticketTierName}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 10px', fontWeight: 'bold' }}>
                                            {booking.quantity}
                                        </td>
                                        <td style={{ padding: '14px 10px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                            Ksh {Number(booking.totalPrice).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '14px 10px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                background: booking.status === 'confirmed' ? '#48bb78' :
                                                    booking.status === 'cancelled' ? '#f56565' : '#ed8936',
                                                color: 'white',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                textTransform: 'capitalize'
                                            }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                {booking.status === 'confirmed' && (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => setSelectedTicketForPass(booking)}
                                                            title="View Digital QR Pass"
                                                        >
                                                            <FaQrcode /> View Pass
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => handleCancelClick(booking)}
                                                            title="Cancel Booking"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'cancelled' && (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(booking.id)}
                                                        title="Delete from list"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Digital QR Ticket Pass Modal */}
            {selectedTicketForPass && (
                <TicketPassModal
                    booking={selectedTicketForPass}
                    onClose={() => setSelectedTicketForPass(null)}
                />
            )}

            {/* Cancel Booking Confirmation Modal */}
            {showCancelModal && bookingToCancel && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <FaTimesCircle style={{ fontSize: '3rem', color: '#e53e3e', margin: '0 auto 15px auto' }} />
                        <h3>Cancel Pass Reservation?</h3>
                        <p style={{ margin: '10px 0', color: '#4a5568' }}>
                            Are you sure you want to cancel your pass for <strong>{bookingToCancel.eventTitle}</strong>?
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#718096' }}>
                            Your reserved spots will be returned to the ticket pool.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>
                                Keep Reservation
                            </button>
                            <button className="btn btn-danger" onClick={handleCancelConfirm}>
                                Yes, Cancel Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;

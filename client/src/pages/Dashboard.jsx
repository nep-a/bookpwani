import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventService } from '../services/eventService';
import EditEventModal from '../components/EditEventModal';
import VerificationForm from '../components/VerificationForm';
import {
    FaTicketAlt,
    FaMoneyBillWave,
    FaUsers,
    FaCalendarCheck,
    FaEdit,
    FaTrash,
    FaEye,
    FaPlus,
    FaCheckCircle,
    FaChartBar,
    FaMapMarkerAlt,
    FaTag
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DiscountModal = ({ event, onClose, onSave }) => {
    const [percentage, setPercentage] = useState(event.discount_percentage || 0);
    const [endDate, setEndDate] = useState(event.discount_end_date ? new Date(event.discount_end_date).toISOString().slice(0,16) : '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/host/events/${event.id}/discount`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    discount_percentage: Number(percentage),
                    discount_end_date: endDate ? new Date(endDate).toISOString() : null
                })
            });
            if (!res.ok) throw new Error('Failed to apply discount');
            onSave();
        } catch (error) {
            console.error(error);
            alert('Failed to apply discount');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Apply Discount to {event.title}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    <div className="form-group">
                        <label>Discount Percentage (%)</label>
                        <input type="number" min="0" max="100" value={percentage} onChange={e => setPercentage(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Discount Valid Until</label>
                        <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Apply Discount'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('overview');
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalTicketsSold: 0,
        activeEventsCount: 0,
        totalViews: 0
    });
    const [editingEvent, setEditingEvent] = useState(null);
    const [discountEvent, setDiscountEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadOrganizerData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let hostEvents = [];
            let hostBookings = [];
            
            // Try fetching from real backend
            try {
                const resEvents = await fetch('http://localhost:5000/api/host/events', { headers: { 'Authorization': \Bearer \\ }});
                if (resEvents.ok) {
                    const data = await resEvents.json();
                    hostEvents = data.events;
                }
                
                const resBookings = await fetch('http://localhost:5000/api/host/bookings', { headers: { 'Authorization': \Bearer \\ }});
                if (resBookings.ok) {
                    const data = await resBookings.json();
                    hostBookings = data.bookings;
                }
            } catch (err) {
                hostEvents = await eventService.getHostEvents(user.id);
                hostBookings = await eventService.getHostBookings(user.id);
            }

            setEvents(hostEvents);
            setBookings(hostBookings);
            
            const totalRevenue = hostBookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (Number(b.total_price) || Number(b.totalPrice) || 0), 0);
            const totalTicketsSold = hostBookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (Number(b.tickets_count) || Number(b.quantity) || 0), 0);
            const activeEventsCount = hostEvents.length;

            setAnalytics({
                totalRevenue,
                totalTicketsSold,
                activeEventsCount,
                totalViews: activeEventsCount * 45 // Dummy stat
            });
        } catch (error) {
            console.error('Error loading organizer data:', error);
            showNotification('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    }, [user, showNotification]);

    useEffect(() => {
        loadOrganizerData();
    }, [loadOrganizerData]);

    const handleDeleteEvent = async (id, title) => {
        if (!confirm(\Are you sure you want to delete "\"? This cannot be undone.\)) return;
        try {
            await eventService.deleteEvent(id);
            showNotification('Event removed successfully', 'success');
            loadOrganizerData();
        } catch (error) {
            showNotification('Failed to delete event', 'error');
        }
    };

    const isVerified = user?.verification_details !== null && user?.verification_details !== undefined;

    if (!isVerified) {
        return <VerificationForm onVerified={() => loadOrganizerData()} />;
    }

    return (
        <div className="container" style={{ marginTop: '90px', paddingBottom: '70px' }}>
            {/* Header with Quick Actions */}
            <div className="dashboard-header-row">
                <div>
                    <h2>Host Dashboard</h2>
                    <p style={{ color: '#718096' }}>Manage your experiences, track sales, and connect with attendees.</p>
                </div>
                <Link to="/create-event" className="btn btn-primary">
                    <FaPlus /> Create New Event
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="dashboard-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(56, 161, 105, 0.1)', color: '#38a169' }}>
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">Ksh {analytics.totalRevenue.toLocaleString()}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255, 107, 0, 0.1)', color: 'var(--primary-color)' }}>
                        <FaTicketAlt />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Tickets Sold</span>
                        <span className="stat-value">{analytics.totalTicketsSold.toLocaleString()}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(49, 130, 206, 0.1)', color: '#3182ce' }}>
                        <FaCalendarCheck />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Active Events</span>
                        <span className="stat-value">{analytics.activeEventsCount}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(128, 90, 213, 0.1)', color: '#805ad5' }}>
                        <FaChartBar />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Page Views</span>
                        <span className="stat-value">{analytics.totalViews.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="dashboard-main-content">
                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={\dashboard-tab \\}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={\dashboard-tab \\}
                        onClick={() => setActiveTab('events')}
                    >
                        My Events
                    </button>
                    <button
                        className={\dashboard-tab \\}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Recent Bookings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="dashboard-tab-panel glass-panel">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <h3>Welcome back, {user.username}!</h3>
                            <p style={{ marginTop: '10px', color: '#4a5568', lineHeight: '1.6' }}>
                                Your dashboard gives you a complete overview of your hosting operations. Navigate to <strong>My Events</strong> to manage your listings, edit details, or check ticket availability. Navigate to <strong>Recent Bookings</strong> to view attendee lists and verify payments.
                            </p>
                            
                            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                                <button className="btn btn-secondary" onClick={() => setActiveTab('events')}>
                                    <FaEye /> View My Events
                                </button>
                                <button className="btn btn-secondary" onClick={() => setActiveTab('bookings')}>
                                    <FaUsers /> View Attendees
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="events-tab">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3>Managed Events</h3>
                            </div>

                            {events.length === 0 ? (
                                <div className="empty-state-card">
                                    <div className="empty-icon-box">
                                        <FaCalendarCheck />
                                    </div>
                                    <h3>No events published yet</h3>
                                    <p>Start hosting and share your unique experiences with the world.</p>
                                    <Link to="/create-event" className="btn btn-primary" style={{ marginTop: '15px' }}>
                                        Create First Event
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-container">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                                <th style={{ padding: '12px' }}>Event</th>
                                                <th style={{ padding: '12px' }}>Category</th>
                                                <th style={{ padding: '12px' }}>Date</th>
                                                <th style={{ padding: '12px' }}>Tickets Sold</th>
                                                <th style={{ padding: '12px' }}>Tickets Left</th>
                                                <th style={{ padding: '12px' }}>Status</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map(evt => {
                                                const totalCapacity = typeof evt.ticketTiers === 'string' ? JSON.parse(evt.ticketTiers).reduce((sum, t) => sum + (t.total || t.available || 0), 0) : evt.ticketTiers?.reduce((sum, t) => sum + (t.total || t.available || 0), 0) || 50;
                                                const sold = bookings.filter(b => b.event_id === evt.id && b.status === 'confirmed').reduce((sum, b) => sum + (b.tickets_count || b.quantity || 0), 0);
                                                const remaining = totalCapacity - sold;
                                                const isClosed = remaining <= 0;
                                                
                                                let hasDiscount = false;
                                                if (evt.discount_percentage && evt.discount_end_date) {
                                                    const endDate = new Date(evt.discount_end_date);
                                                    if (endDate > new Date()) hasDiscount = true;
                                                }

                                                return (
                                                    <tr key={evt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', opacity: isClosed ? 0.7 : 1 }}>
                                                        <td style={{ padding: '12px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <img
                                                                    src={evt.image}
                                                                    alt={evt.title}
                                                                    style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                                                                />
                                                                <strong>{evt.title}</strong>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span className="badge" style={{ background: '#edf2f7', color: '#2d3748' }}>
                                                                {evt.category}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                                                            <div>{evt.date || evt.startDate}</div>
                                                        </td>
                                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                                            {sold} / {totalCapacity}
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{ color: remaining > 0 ? '#38a169' : '#e53e3e', fontWeight: 'bold' }}>
                                                                {isClosed ? 'Sold Out' : remaining}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            {isClosed ? (
                                                                <span className="badge" style={{ background: '#fed7d7', color: '#c53030' }}>Closed</span>
                                                            ) : hasDiscount ? (
                                                                <span className="badge" style={{ background: '#feebc8', color: '#dd6b20' }}>{evt.discount_percentage}% Off</span>
                                                            ) : (
                                                                <span className="badge" style={{ background: '#c6f6d5', color: '#276749' }}>Active</span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                {!isClosed && (
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={() => setDiscountEvent(evt)}
                                                                        title="Apply Discount"
                                                                    >
                                                                        <FaTag /> Discount
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn btn-sm btn-secondary"
                                                                    onClick={() => setEditingEvent(evt)}
                                                                    title="Edit Event"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDeleteEvent(evt.id, evt.title)}
                                                                    title="Delete Event"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="bookings-tab">
                            <h3>Recent Bookings (Attendees)</h3>
                            {bookings.length === 0 ? (
                                <p style={{ marginTop: '15px', color: '#718096' }}>No tickets have been sold yet.</p>
                            ) : (
                                <div className="table-container" style={{ marginTop: '15px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                                <th style={{ padding: '12px' }}>Attendee</th>
                                                <th style={{ padding: '12px' }}>Event</th>
                                                <th style={{ padding: '12px' }}>Tier</th>
                                                <th style={{ padding: '12px' }}>Qty</th>
                                                <th style={{ padding: '12px' }}>Total Paid</th>
                                                <th style={{ padding: '12px' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map(booking => {
                                                const evtData = booking.event || events.find(e => e.id === booking.event_id) || {};
                                                return (
                                                    <tr key={booking.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <td style={{ padding: '12px' }}>
                                                            <strong>{booking.attendeeName || 'Traveler'}</strong>
                                                            <div style={{ fontSize: '0.8rem', color: '#718096' }}>{booking.attendeeEmail || booking.attendeePhone || ''}</div>
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                                                            {evtData.title || booking.eventTitle || 'Unknown Event'}
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                                                            <span className="badge" style={{ background: '#edf2f7', color: '#2d3748' }}>
                                                                {booking.ticket_tier_name || booking.ticketTierName || 'General'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                                            {booking.tickets_count || booking.quantity}
                                                        </td>
                                                        <td style={{ padding: '12px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                                            Ksh {Number(booking.total_price || booking.totalPrice).toLocaleString()}
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{ color: booking.status === 'confirmed' ? '#38a169' : '#e53e3e', fontWeight: '600', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSave={() => {
                        setEditingEvent(null);
                        loadOrganizerData();
                    }}
                />
            )}
            
            {discountEvent && (
                <DiscountModal 
                    event={discountEvent}
                    onClose={() => setDiscountEvent(null)}
                    onSave={() => {
                        setDiscountEvent(null);
                        showNotification('Discount applied successfully!', 'success');
                        loadOrganizerData();
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;

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
                const resEvents = await fetch('http://localhost:5000/api/host/events', { headers: { 'Authorization': `Bearer ${token}` }});
                if (resEvents.ok) {
                    const data = await resEvents.json();
                    hostEvents = data.events || [];
                }
                
                const resBookings = await fetch('http://localhost:5000/api/host/bookings', { headers: { 'Authorization': `Bearer ${token}` }});
                if (resBookings.ok) {
                    const data = await resBookings.json();
                    hostBookings = data.bookings || [];
                }
            } catch (err) {
                console.error('Failed to fetch from backend:', err);
                hostEvents = [];
                hostBookings = [];
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
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/host/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');
            
            showNotification('Event removed successfully', 'success');
            loadOrganizerData();
        } catch (error) {
            console.error('Delete event error:', error);
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
                    <h2>Welcome back, {user?.username || 'Host'}!</h2>
                    <p style={{ color: '#718096' }}>Manage your experiences and track ticket sales.</p>
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
            </div>

            {/* Main Content Area */}
            <div className="dashboard-main-content">
                <div className="dashboard-tab-panel glass-panel">
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
                                                                    src={evt.image?.startsWith('http') ? evt.image : 'http://localhost:5000/' + evt.image}
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

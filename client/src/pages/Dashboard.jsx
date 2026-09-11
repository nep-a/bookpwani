import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventService } from '../services/eventService';
import EditEventModal from '../components/EditEventModal';
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
    FaMapMarkerAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
    const [loading, setLoading] = useState(false);

    const loadOrganizerData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const hostEvents = await eventService.getHostEvents(user.id);
            const hostBookings = await eventService.getHostBookings(user.id);
            const stats = await eventService.getHostAnalytics(user.id);

            setEvents(hostEvents);
            setBookings(hostBookings);
            setAnalytics(stats);
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
            await eventService.deleteEvent(id);
            showNotification('Event removed successfully', 'success');
            loadOrganizerData();
        } catch (error) {
            showNotification('Failed to delete event', 'error');
        }
    };

    return (
        <div className="container" style={{ marginTop: '90px', paddingBottom: '70px' }}>
            {/* Header with Quick Actions */}
            <div className="dashboard-header-row">
                <div>
                    <h2>Organizer Dashboard</h2>
                    <p style={{ color: '#718096' }}>
                        Welcome back, <strong>{user?.username}</strong>! Manage your events, ticket inventory, and attendee rosters.
                    </p>
                </div>
                <Link to="/create-event" className="btn btn-primary" style={{ gap: '8px' }}>
                    <FaPlus /> Post New Event
                </Link>
            </div>

            {/* KPI Metric Cards */}
            <div className="dashboard-stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 0, 80, 0.1)', color: 'var(--primary-color)' }}>
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Total Ticket Sales</span>
                        <strong className="stat-value">Ksh {Number(analytics.totalRevenue || 0).toLocaleString()}</strong>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78' }}>
                        <FaTicketAlt />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Tickets Issued</span>
                        <strong className="stat-value">{analytics.totalTicketsSold || 0}</strong>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(49, 130, 206, 0.1)', color: '#3182ce' }}>
                        <FaCalendarCheck />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Active Events</span>
                        <strong className="stat-value">{analytics.activeEventsCount || events.length}</strong>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(128, 90, 213, 0.1)', color: '#805ad5' }}>
                        <FaEye />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Event Views</span>
                        <strong className="stat-value">{Number(analytics.totalViews || 0).toLocaleString()}</strong>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="dashboard-tabs-bar">
                <button
                    className={`dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <FaChartBar /> Overview & Events ({events.length})
                </button>
                <button
                    className={`dash-tab-btn ${activeTab === 'attendees' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attendees')}
                >
                    <FaUsers /> Attendee Bookings ({bookings.length})
                </button>
            </div>

            {/* TAB 1: MY EVENTS */}
            {activeTab === 'overview' && (
                <div className="glass-panel" style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>My Published Events</h3>
                        <span style={{ fontSize: '0.85rem', color: '#718096' }}>Showing all created experiences</span>
                    </div>

                    {events.length === 0 ? (
                        <div className="empty-state-card" style={{ padding: '30px' }}>
                            <p>You haven't posted any events yet.</p>
                            <Link to="/create-event" className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>
                                Post Your First Event
                            </Link>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                        <th style={{ padding: '12px' }}>Event</th>
                                        <th style={{ padding: '12px' }}>Category</th>
                                        <th style={{ padding: '12px' }}>Date & Venue</th>
                                        <th style={{ padding: '12px' }}>Base Price</th>
                                        <th style={{ padding: '12px' }}>Tickets Left</th>
                                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(evt => {
                                        const remaining = evt.ticketTiers?.reduce((sum, t) => sum + (t.available || 0), 0) || 0;
                                        return (
                                            <tr key={evt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
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
                                                    <div>{evt.startDate}</div>
                                                    <div style={{ color: '#718096', fontSize: '0.8rem' }}><FaMapMarkerAlt /> {evt.venue || evt.location}</div>
                                                </td>
                                                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                                    Ksh {Number(evt.price).toLocaleString()}
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{
                                                        color: remaining > 20 ? '#38a169' : '#e53e3e',
                                                        fontWeight: '600',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {remaining > 0 ? `${remaining} spots` : 'Sold Out'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
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

            {/* TAB 2: ATTENDEE BOOKINGS */}
            {activeTab === 'attendees' && (
                <div className="glass-panel" style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>Ticket Orders & Attendee Roster</h3>
                        <span style={{ fontSize: '0.85rem', color: '#718096' }}>All confirmed passes booked for your events</span>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="empty-state-card" style={{ padding: '30px' }}>
                            <p>No attendee orders placed yet.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                        <th style={{ padding: '12px' }}>Ref Code</th>
                                        <th style={{ padding: '12px' }}>Event</th>
                                        <th style={{ padding: '12px' }}>Attendee</th>
                                        <th style={{ padding: '12px' }}>Contact</th>
                                        <th style={{ padding: '12px' }}>Tier</th>
                                        <th style={{ padding: '12px' }}>Qty</th>
                                        <th style={{ padding: '12px' }}>Total (Ksh)</th>
                                        <th style={{ padding: '12px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                {b.ticketCode}
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                                                {b.eventTitle}
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: '600' }}>
                                                {b.travelerName}
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '0.85rem', color: '#4a5568' }}>
                                                <div>{b.travelerPhone}</div>
                                                <div style={{ color: '#718096' }}>{b.travelerEmail}</div>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span className="badge" style={{ background: '#edf2f7', color: '#2d3748' }}>
                                                    {b.ticketTierName}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                                {b.quantity}
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                                Ksh {Number(b.totalPrice).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    background: b.status === 'confirmed' ? '#48bb78' : '#f56565',
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Event Modal */}
            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onUpdated={loadOrganizerData}
                />
            )}
        </div>
    );
};

export default Dashboard;

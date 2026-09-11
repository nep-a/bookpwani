import { useState, useEffect, useCallback } from 'react';
import { eventService, DEMO_USERS } from '../../services/eventService';
import { useNotification } from '../../context/NotificationContext';
import {
    FaTicketAlt,
    FaMoneyBillWave,
    FaUsers,
    FaCalendarCheck,
    FaTrash,
    FaStar,
    FaCheckCircle,
    FaShieldAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadPlatformData = useCallback(async () => {
        setLoading(true);
        try {
            const allEvents = await eventService.getEvents();
            const allBookings = await eventService.getAllBookingsAdmin();
            const allUsers = await eventService.getAllUsersAdmin();

            setEvents(allEvents);
            setBookings(allBookings);
            setUsers(allUsers);
        } catch (error) {
            console.error('Admin data load error:', error);
            showNotification('Failed to load admin platform data', 'error');
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        loadPlatformData();
    }, [loadPlatformData]);

    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const totalTicketsSold = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.quantity || 0), 0);

    const handleDeleteEvent = async (id, title) => {
        if (!confirm(`Admin: Remove event "${title}" from the platform?`)) return;
        try {
            await eventService.deleteEvent(id);
            showNotification('Event removed by admin', 'success');
            loadPlatformData();
        } catch (error) {
            showNotification('Failed to delete event', 'error');
        }
    };

    const handleToggleFeatured = async (event) => {
        try {
            await eventService.updateEvent(event.id, { featured: !event.featured });
            showNotification(`Event ${!event.featured ? 'promoted to Featured' : 'unfeatured'}`, 'info');
            loadPlatformData();
        } catch (error) {
            showNotification('Failed to update event', 'error');
        }
    };

    return (
        <div className="container" style={{ marginTop: '90px', paddingBottom: '70px' }}>
            <div className="dashboard-header-row">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaShieldAlt style={{ color: '#e53e3e', fontSize: '1.4rem' }} />
                        <h2 style={{ margin: 0 }}>System Administration</h2>
                    </div>
                    <p style={{ color: '#718096' }}>Platform-wide oversight of events, ticket reservations, and registered users.</p>
                </div>
            </div>

            {/* Platform Stats Grid */}
            <div className="dashboard-stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 0, 80, 0.1)', color: 'var(--primary-color)' }}>
                        <FaMoneyBillWave />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Platform Gross Revenue</span>
                        <strong className="stat-value">Ksh {totalRevenue.toLocaleString()}</strong>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78' }}>
                        <FaTicketAlt />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Total Passes Booked</span>
                        <strong className="stat-value">{totalTicketsSold}</strong>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(49, 130, 206, 0.1)', color: '#3182ce' }}>
                        <FaCalendarCheck />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Live Events</span>
                        <strong className="stat-value">{events.length}</strong>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(128, 90, 213, 0.1)', color: '#805ad5' }}>
                        <FaUsers />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Registered Accounts</span>
                        <strong className="stat-value">{users.length}</strong>
                    </div>
                </div>
            </div>

            {/* Admin Tabs */}
            <div className="dashboard-tabs-bar">
                <button
                    className={`dash-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                >
                    <FaCalendarCheck /> Platform Events ({events.length})
                </button>
                <button
                    className={`dash-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    <FaTicketAlt /> All Ticket Passes ({bookings.length})
                </button>
                <button
                    className={`dash-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <FaUsers /> Accounts ({users.length})
                </button>
            </div>

            {/* TAB: EVENTS */}
            {activeTab === 'events' && (
                <div className="glass-panel" style={{ marginTop: '20px' }}>
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                    <th style={{ padding: '12px' }}>Event Name</th>
                                    <th style={{ padding: '12px' }}>Category</th>
                                    <th style={{ padding: '12px' }}>Venue</th>
                                    <th style={{ padding: '12px' }}>Date</th>
                                    <th style={{ padding: '12px' }}>Price</th>
                                    <th style={{ padding: '12px' }}>Featured</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(evt => (
                                    <tr key={evt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img
                                                    src={evt.image}
                                                    alt={evt.title}
                                                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                                                />
                                                <strong>{evt.title}</strong>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span className="badge" style={{ background: '#edf2f7', color: '#2d3748' }}>
                                                {evt.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{evt.venue}</td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{evt.startDate}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Ksh {Number(evt.price).toLocaleString()}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                className={`btn btn-sm ${evt.featured ? 'btn-primary' : 'btn-secondary'}`}
                                                onClick={() => handleToggleFeatured(evt)}
                                                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                                            >
                                                <FaStar /> {evt.featured ? 'Featured' : 'Standard'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteEvent(evt.id, evt.title)}
                                                title="Delete Event"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === 'bookings' && (
                <div className="glass-panel" style={{ marginTop: '20px' }}>
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                    <th style={{ padding: '12px' }}>Ticket Code</th>
                                    <th style={{ padding: '12px' }}>Event</th>
                                    <th style={{ padding: '12px' }}>Attendee</th>
                                    <th style={{ padding: '12px' }}>Contact</th>
                                    <th style={{ padding: '12px' }}>Qty</th>
                                    <th style={{ padding: '12px' }}>Amount</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{b.ticketCode}</td>
                                        <td style={{ padding: '12px' }}>{b.eventTitle}</td>
                                        <td style={{ padding: '12px', fontWeight: '600' }}>{b.travelerName}</td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{b.travelerPhone || b.travelerEmail}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{b.quantity}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                            Ksh {Number(b.totalPrice).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                background: b.status === 'confirmed' ? '#48bb78' : '#f56565',
                                                color: 'white',
                                                fontSize: '0.75rem'
                                            }}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: USERS */}
            {activeTab === 'users' && (
                <div className="glass-panel" style={{ marginTop: '20px' }}>
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--glass-border)' }}>
                                    <th style={{ padding: '12px' }}>User</th>
                                    <th style={{ padding: '12px' }}>Email</th>
                                    <th style={{ padding: '12px' }}>Role</th>
                                    <th style={{ padding: '12px' }}>Contact</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {u.avatar ? (
                                                    <img src={u.avatar} alt={u.username} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                ) : (
                                                    <div className="host-avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                                        {u.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <strong>{u.username}</strong>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{u.email}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span className="badge" style={{
                                                background: u.role === 'admin' ? '#e53e3e' : u.role === 'host' ? 'var(--primary-color)' : '#3182ce',
                                                color: 'white'
                                            }}>
                                                {u.role === 'host' ? 'Organizer' : u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{u.phone_number || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ color: '#48bb78', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                <FaCheckCircle /> Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

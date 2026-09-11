import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventService, COASTAL_CATEGORIES, COASTAL_DESTINATIONS } from '../services/eventService';
import VerificationForm from '../components/VerificationForm';
import { FaPlus, FaImage, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaTag, FaFileAlt } from 'react-icons/fa';

const PRESET_COASTAL_IMAGES = [
    { label: 'Culture & Heritage', url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Swahili Food & Dhow', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Beachfront Stay & Villa', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Beach & Watersports', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Coastal Safari & Bush', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80' }
];

const CreateEvent = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Culture',
        location: 'Diani Beach',
        venue: '',
        startDate: '',
        endDate: '',
        time: '8:00 AM - 5:00 PM',
        price: '3500',
        capacity: '50',
        image: PRESET_COASTAL_IMAGES[0].url,
        vipPrice: '7500',
        vipCapacity: '10'
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectPreset = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.venue || !formData.startDate) {
            showNotification('Please fill in all required experience details', 'error');
            return;
        }

        setLoading(true);
        try {
            const ticketTiers = [
                {
                    id: `tier_${Date.now()}_std`,
                    name: 'Standard Experience Pass',
                    price: Number(formData.price) || 3500,
                    available: Number(formData.capacity) || 50,
                    total: Number(formData.capacity) || 50,
                    perks: ['Guided Coastal Tour', 'Equipment & Entry fees included']
                },
                {
                    id: `tier_${Date.now()}_vip`,
                    name: 'VIP Private Experience',
                    price: Number(formData.vipPrice) || (Number(formData.price) * 2),
                    available: Number(formData.vipCapacity) || 10,
                    total: Number(formData.vipCapacity) || 10,
                    perks: ['Private Guide & Transport', 'Seafood Banquet Lunch', 'Complimentary Coconut Drink']
                }
            ];

            await eventService.createEvent({
                ...formData,
                ticketTiers
            }, user);

            showNotification('🎉 Coastal experience published successfully!', 'success');
            navigate('/');
        } catch (error) {
            showNotification(error.message || 'Failed to create experience', 'error');
        } finally {
            setLoading(false);
        }
    };

    const validDestinations = COASTAL_DESTINATIONS.filter(d => d !== 'All Destinations');

    const isVerified = user?.verification_details !== null && user?.verification_details !== undefined;

    if (!isVerified) {
        return <VerificationForm onVerified={() => navigate('/dashboard')} />;
    }

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
            <div className="create-event-layout">
                {/* Form Column */}
                <div className="glass-panel create-event-form-panel">
                    <div className="panel-title-block">
                        <h2>Post Coastal Experience</h2>
                        <p>Publish a Culture, Food, Stay, Beach, or Safari experience across the Kenyan coast.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="create-event-form">
                        {/* Title */}
                        <div className="form-group">
                            <label><FaFileAlt /> Experience Title *</label>
                            <input
                                name="title"
                                placeholder="e.g. Wasini Island Dhow Cruise & Dolphin Snorkel"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Category & Location */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label><FaTag /> Coastal Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange}>
                                    {COASTAL_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FaMapMarkerAlt /> Destination Region *</label>
                                <select name="location" value={formData.location} onChange={handleChange}>
                                    {validDestinations.map((dest, i) => (
                                        <option key={i} value={dest}>{dest}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Specific Venue */}
                        <div className="form-group">
                            <label><FaMapMarkerAlt /> Specific Venue / Meeting Point *</label>
                            <input
                                name="venue"
                                placeholder="e.g. Shimoni Jetty, South Coast or Old Town Mombasa"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Dates & Times */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label><FaCalendarAlt /> Experience Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Operating Hours / Timing</label>
                                <input
                                    name="time"
                                    placeholder="e.g. 7:30 AM - 4:00 PM"
                                    value={formData.time}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Ticket Tier Pricing */}
                        <div className="form-section-divider">
                            <h4><FaTicketAlt /> Pricing & Capacity Setup</h4>
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Standard Price (Ksh) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="e.g. 3500"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Standard Capacity (Spots)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    placeholder="e.g. 50"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>VIP / Private Price (Ksh)</label>
                                <input
                                    type="number"
                                    name="vipPrice"
                                    placeholder="e.g. 7500"
                                    value={formData.vipPrice}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>VIP Capacity (Spots)</label>
                                <input
                                    type="number"
                                    name="vipCapacity"
                                    placeholder="e.g. 10"
                                    value={formData.vipCapacity}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Poster Image */}
                        <div className="form-group">
                            <label><FaImage /> Banner / Poster Image URL</label>
                            <input
                                name="image"
                                placeholder="Paste image link or choose coastal preset below"
                                value={formData.image}
                                onChange={handleChange}
                                required
                            />
                            <div className="preset-images-strip">
                                <span style={{ fontSize: '0.8rem', color: '#718096' }}>Or pick a coastal photo preset:</span>
                                <div className="preset-buttons-row">
                                    {PRESET_COASTAL_IMAGES.map((preset, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`preset-pill ${formData.image === preset.url ? 'active' : ''}`}
                                            onClick={() => handleSelectPreset(preset.url)}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>Description & Experience Highlights</label>
                            <textarea
                                name="description"
                                placeholder="Describe what travelers will experience, what's included, what to wear..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-submit-event"
                            disabled={loading}
                        >
                            <FaPlus /> {loading ? 'Publishing...' : 'Publish Coastal Experience'}
                        </button>
                    </form>
                </div>

                {/* Live Preview Column */}
                <div className="create-event-preview-col">
                    <div className="sticky-preview-box">
                        <span className="preview-label">Live Preview</span>
                        <div className="event-card glass-panel preview-mode">
                            <div className="event-card-media">
                                <img
                                    src={formData.image || PRESET_COASTAL_IMAGES[0].url}
                                    alt="Preview"
                                    className="event-card-img"
                                />
                                <div className="event-category-chip">
                                    <FaTag style={{ fontSize: '0.75rem' }} /> {formData.category}
                                </div>
                            </div>
                            <div className="event-card-content">
                                <div className="event-organizer-row">
                                    <span className="event-organizer-name">
                                        {user?.username || 'You (Host)'}
                                    </span>
                                </div>
                                <h3 className="event-title">{formData.title || 'Your Coastal Experience Title'}</h3>
                                <div className="event-meta-row">
                                    <span><FaCalendarAlt /> {formData.startDate || 'YYYY-MM-DD'} • {formData.time}</span>
                                    <span><FaMapMarkerAlt /> {formData.venue || formData.location || 'Coastal Location'}</span>
                                </div>
                                <p className="event-card-desc">
                                    {formData.description ? formData.description.slice(0, 90) + '...' : 'Experience description preview will appear here.'}
                                </p>
                                <div className="event-card-footer">
                                    <div className="event-price-block">
                                        <span className="event-price-label">Passes from</span>
                                        <span className="event-price-val">Ksh {Number(formData.price || 0).toLocaleString()}</span>
                                    </div>
                                    <button className="btn btn-primary" type="button" disabled>
                                        <FaTicketAlt /> Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;

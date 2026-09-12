import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventService, COASTAL_CATEGORIES, COASTAL_DESTINATIONS } from '../services/eventService';
import VerificationForm from '../components/VerificationForm';
import { FaPlus, FaImage, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaTag, FaFileAlt } from 'react-icons/fa';



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
        vipPrice: '7500',
        vipCapacity: '10'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.venue || !formData.startDate) {
            showNotification('Please fill in all required experience details', 'error');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price);
            submitData.append('date', formData.startDate);
            submitData.append('venue', formData.venue);
            submitData.append('time', formData.time);
            submitData.append('category', formData.category);
            submitData.append('capacity', formData.capacity);
            submitData.append('vipPrice', formData.vipPrice);
            submitData.append('vipCapacity', formData.vipCapacity);
            if (imageFile) {
                submitData.append('eventImage', imageFile);
            }

            const res = await fetch('http://localhost:5000/api/host/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create event');
            }

            showNotification('Coastal experience published successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error('Create experience error:', error);
            showNotification('Failed to publish experience', 'error');
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
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                            <label><FaImage /> Banner / Poster Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
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
            </div>
        </div>
    );
};

export default CreateEvent;

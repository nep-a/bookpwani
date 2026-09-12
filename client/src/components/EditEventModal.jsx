import { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { EVENT_CATEGORIES } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';

const EditEventModal = ({ event, onClose, onUpdated }) => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Music & Concerts',
        location: event.location || '',
        venue: event.venue || event.location || '',
        startDate: event.startDate || event.date || '',
        time: event.time || '',
        price: event.price || ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            if (imageFile) {
                submitData.append('eventImage', imageFile);
            }

            const res = await fetch(`http://localhost:5000/api/host/events/${event.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to update event');
            }

            showNotification('Event updated successfully!', 'success');
            if (onUpdated) onUpdated();
            onClose();
        } catch (error) {
            console.error('Update event error:', error);
            showNotification(error.message || 'Failed to update event', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><FaTimes /></button>
                <h2>Edit Event Details</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    <div className="form-group">
                        <label>Event Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                {EVENT_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Base Ticket Price (Ksh)</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>City / Region</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Specific Venue</label>
                            <input
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Event Date</label>
                            <input
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Time Schedule</label>
                            <input
                                name="time"
                                placeholder="e.g. 2:00 PM - 11:00 PM"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Banner Image (Upload new to replace)</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                            <FaSave /> {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;

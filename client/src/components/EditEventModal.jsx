import { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { EVENT_CATEGORIES, eventService } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';

const EditEventModal = ({ event, onClose, onUpdated }) => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Music & Concerts',
        location: event.location || '',
        venue: event.venue || event.location || '',
        startDate: event.startDate || '',
        time: event.time || '',
        price: event.price || '',
        image: event.image || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await eventService.updateEvent(event.id, {
                ...formData,
                price: Number(formData.price)
            });
            showNotification('Event updated successfully!', 'success');
            if (onUpdated) onUpdated();
            onClose();
        } catch (error) {
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
                        <label>Banner Image URL</label>
                        <input
                            name="image"
                            placeholder="https://..."
                            value={formData.image}
                            onChange={handleChange}
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

import { useState, useContext } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';
import { eventService } from '../services/eventService';

const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(null);
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await eventService.addReview(booking.eventId, {
                user,
                rating,
                comment
            });
            showNotification('Thank you! Review submitted successfully.', 'success');
            if (onReviewSubmitted) onReviewSubmitted();
            onClose();
        } catch (error) {
            showNotification(error.message || 'Failed to submit review', 'error');
        }
    };

    const eventName = booking.eventTitle || booking.Reel?.title || 'this event';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><FaTimes /></button>
                <h2>Rate Your Experience</h2>
                <p style={{ color: '#64748b' }}>How was your experience attending <strong>{eventName}</strong>?</p>

                <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 0, boxShadow: 'none', background: 'transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', marginTop: '10px' }}>
                        {[...Array(5)].map((star, i) => {
                            const ratingValue = i + 1;
                            return (
                                <label key={i}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                        style={{ display: 'none' }}
                                    />
                                    <FaStar
                                        className="star"
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        size={32}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(null)}
                                        style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <div className="form-group">
                        <textarea
                            placeholder="Share highlights, favorite artists, venue organization..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            minLength={5}
                            maxLength={500}
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;

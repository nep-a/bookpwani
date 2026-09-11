import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setBio(user.bio || '');
            setPhoneNumber(user.phone_number || '');
            setAvatarUrl(user.avatar || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = {
                ...user,
                username,
                bio,
                phone_number: phoneNumber,
                avatar: avatarUrl || user?.avatar
            };

            setUser(updatedUser);
            localStorage.setItem('zuru_current_user', JSON.stringify(updatedUser));
            localStorage.setItem('user', JSON.stringify(updatedUser));
            showNotification('Profile updated successfully!', 'success');
        } catch (error) {
            showNotification('Error updating profile: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
            <div className="glass-panel" style={{ maxWidth: '540px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center' }}>Account Profile</h2>
                <p style={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role === 'host' ? 'Event Organizer' : user?.role}</strong>
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid var(--primary-color)',
                        background: '#eee'
                    }}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '2rem' }}>
                                {username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '100%', boxShadow: 'none', padding: '0', background: 'transparent' }}>
                    <div className="form-group">
                        <label>Avatar Image URL</label>
                        <input
                            type="text"
                            placeholder="https://..."
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Username / Display Name</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Phone / M-Pesa Number</label>
                        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+254 7XX XXX XXX" />
                    </div>

                    <div className="form-group">
                        <label>Bio / About</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="3"
                            placeholder="Tell attendees about yourself or your organization..."
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;

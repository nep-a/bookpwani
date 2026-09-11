import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setBio(user.bio || '');
            setPhoneNumber(user.phone_number || '');
            setPreviewUrl(user.profile_pic || user.avatar || '');
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', username);
            formData.append('phoneNumber', phoneNumber);
            formData.append('bio', bio);
            if (avatarFile) formData.append('profilePic', avatarFile);

            const rolePath = user?.role === 'host' ? 'host' : 'traveler';
            const res = await fetch(`http://localhost:5000/api/${rolePath}/profile`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...user, ...data[rolePath] }; // either host or traveler
                setUser(updatedUser);
                localStorage.setItem('zuru_current_user', JSON.stringify(updatedUser));
                localStorage.setItem('user', JSON.stringify(updatedUser));
                showNotification('Profile updated successfully!', 'success');
            } else {
                // Mock fallback for demo if backend isn't linked
                const updatedUser = {
                    ...user,
                    username,
                    bio,
                    phone_number: phoneNumber,
                    avatar: previewUrl || user?.avatar,
                    profile_pic: previewUrl || user?.profile_pic
                };
                setUser(updatedUser);
                localStorage.setItem('zuru_current_user', JSON.stringify(updatedUser));
                localStorage.setItem('user', JSON.stringify(updatedUser));
                showNotification('Profile updated (Demo Mode)', 'success');
            }
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
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '2rem' }}>
                                {username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '100%', boxShadow: 'none', padding: '0', background: 'transparent' }}>
                    <div className="form-group">
                        <label>Upload Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ padding: '8px', background: '#f7fafc', border: '1px solid #cbd5e0', borderRadius: '8px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Username / Display Name</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>M-Pesa Phone Number</label>
                        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+254 7XX XXX XXX" required />
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

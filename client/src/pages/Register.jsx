import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import { FaUser, FaBuilding, FaUserTie, FaTicketAlt } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'traveler',
        hostType: 'individual'
    });
    const { register } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.role,
            formData.hostType
        );
        setLoading(false);
        if (res.success) {
            showNotification(`Welcome to ZuruEvents, ${formData.username}!`, 'success');
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-form" style={{ maxWidth: '460px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div className="logo-badge" style={{ margin: '0 auto 10px auto', width: '48px', height: '48px' }}>
                        <FaTicketAlt style={{ color: 'white', fontSize: '1.4rem' }} />
                    </div>
                    <h2>Join ZuruEvents</h2>
                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                        Create an account to book event passes or publish experiences.
                    </p>
                </div>

                {error && <p style={{ color: '#e53e3e', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                        <label>Your Name / Organization</label>
                        <input
                            name="username"
                            placeholder="e.g. Maya Safari"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Choose a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Account Intent</label>
                        <CustomSelect
                            placeholder="Select Account Type"
                            value={formData.role}
                            onChange={(val) => setFormData({ ...formData, role: val })}
                            options={[
                                { value: 'traveler', label: 'Attendee (Book Tickets)', icon: <FaUser /> },
                                { value: 'host', label: 'Event Host / Organizer', icon: <FaUserTie /> }
                            ]}
                        />
                    </div>
                    {formData.role === 'host' && (
                        <div className="form-group">
                            <label style={{ marginBottom: '8px', display: 'block' }}>Organization Type</label>
                            <CustomSelect
                                placeholder="Select Host Type"
                                value={formData.hostType}
                                onChange={(val) => setFormData({ ...formData, hostType: val })}
                                options={[
                                    { value: 'individual', label: 'Individual Creator', icon: <FaUser /> },
                                    { value: 'business', label: 'Registered Agency / Venue', icon: <FaBuilding /> }
                                ]}
                            />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#718096' }}>Already have an account? </span>
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

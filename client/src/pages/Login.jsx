import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserTie, FaUser, FaShieldAlt, FaTicketAlt } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, switchDemoUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    const handleDemoLogin = (role) => {
        switchDemoUser(role);
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-form" style={{ maxWidth: '460px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div className="logo-badge" style={{ margin: '0 auto 10px auto', width: '48px', height: '48px' }}>
                        <FaTicketAlt style={{ color: 'white', fontSize: '1.4rem' }} />
                    </div>
                    <h2>Welcome to bookpwani</h2>
                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                        Sign in to access your digital tickets and manage events.
                    </p>
                </div>

                {/* 1-Click Demo Login Box */}
                <div className="demo-accounts-card">
                    <span className="demo-header-title">⚡ Instant 1-Click Demo Access</span>
                    <div className="demo-buttons-grid">
                        <button
                            type="button"
                            className="demo-login-btn host-demo"
                            onClick={() => handleDemoLogin('host')}
                        >
                            <FaUserTie />
                            <div>
                                <strong>Organizer View</strong>
                                <span>Post events & manage sales</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="demo-login-btn attendee-demo"
                            onClick={() => handleDemoLogin('traveler')}
                        >
                            <FaUser />
                            <div>
                                <strong>Attendee View</strong>
                                <span>Browse & book event passes</span>
                            </div>
                        </button>

                        {/* Admin demo button removed per requirements */}
                    </div>
                </div>

                <div className="auth-divider-line">
                    <span>or sign in with email</span>
                </div>

                {error && <p style={{ color: '#e53e3e', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="e.g. attendee@bookpwani.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                        Sign In
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#718096' }}>Don't have an account yet? </span>
                    <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

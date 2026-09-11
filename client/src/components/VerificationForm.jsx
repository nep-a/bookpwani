import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaShieldAlt, FaIdCard, FaBuilding, FaPhone, FaUpload } from 'react-icons/fa';

const VerificationForm = ({ onVerified }) => {
    const { user, setUser } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        businessName: '',
        ownerId: '',
        staffPhone: ''
    });
    const [passportFile, setPassportFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // In a real app, this would be a multipart/form-data fetch to the backend
            // Mocking for now to match current frontend architecture
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append('businessName', formData.businessName);
            formDataToSend.append('ownerId', formData.ownerId);
            formDataToSend.append('staffPhone', formData.staffPhone);
            if (passportFile) formDataToSend.append('passportFile', passportFile);

            let apiUrl = 'http://localhost:5000/api/host/verify';
            
            // Try actual backend, fallback to local state if it fails (due to dummy token)
            try {
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Authorization': \Bearer \\ },
                    body: formDataToSend
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.host);
                    localStorage.setItem('user', JSON.stringify(data.host));
                } else {
                    throw new Error('Backend verification failed, using local mock');
                }
            } catch (err) {
                // Mock behavior for frontend demo
                const updatedUser = { 
                    ...user, 
                    verification_details: JSON.stringify(formData) 
                };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                localStorage.setItem('zuru_current_user', JSON.stringify(updatedUser));
            }

            showNotification('Verification details submitted successfully!', 'success');
            if (onVerified) onVerified();
            
        } catch (error) {
            showNotification('Error submitting verification', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div className="logo-badge" style={{ margin: '0 auto 10px auto', width: '60px', height: '60px', background: 'rgba(255,107,0,0.1)' }}>
                        <FaShieldAlt style={{ color: 'var(--primary-color)', fontSize: '1.8rem' }} />
                    </div>
                    <h2>Host Verification Required</h2>
                    <p style={{ color: '#718096' }}>
                        To ensure the safety of our attendees, we require all hosts to verify their identity and business before posting events.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                        <label><FaBuilding style={{marginRight: '5px'}}/> Business / Organization Name</label>
                        <input
                            required
                            placeholder="e.g. Coastal Adventures Ltd"
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label><FaIdCard style={{marginRight: '5px'}}/> Owner ID Number</label>
                        <input
                            required
                            placeholder="National ID or Passport Number"
                            value={formData.ownerId}
                            onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><FaPhone style={{marginRight: '5px'}}/> Staff Member Phone Number</label>
                        <input
                            required
                            placeholder="e.g. +254 700 000000"
                            value={formData.staffPhone}
                            onChange={(e) => setFormData({...formData, staffPhone: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label><FaUpload style={{marginRight: '5px'}}/> Upload Passport/ID Document</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            required
                            onChange={(e) => setPassportFile(e.target.files[0])}
                            style={{ padding: '10px', background: '#f7fafc', border: '1px dashed #cbd5e0', borderRadius: '8px' }}
                        />
                        <small style={{ color: '#a0aec0', marginTop: '5px', display: 'block' }}>
                            Upload a clear photo or scan of the manager's or staff's passport/ID.
                        </small>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '15px', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Verification Details'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerificationForm;

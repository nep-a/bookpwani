import { createContext, useState, useEffect } from 'react';
import { eventService } from '../services/eventService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('zuru_current_user') || localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            let data = null;
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    data = await response.json();
                } else {
                    const err = await response.json();
                    throw new Error(err.message || 'Backend login failed');
                }
            } catch (backendErr) {
                console.warn('Backend unavailable, falling back to local auth');
                data = await eventService.login(email, password);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('zuru_current_user', JSON.stringify(data.user));
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message || 'Login failed' };
        }
    };

    const register = async (username, email, password, role, hostType) => {
        try {
            let data = null;
            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password, role, hostType })
                });
                if (response.ok) {
                    data = await response.json();
                } else {
                    const err = await response.json();
                    throw new Error(err.message || 'Backend registration failed');
                }
            } catch (backendErr) {
                console.warn('Backend unavailable, falling back to local auth');
                data = await eventService.register(username, email, password, role, hostType);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('zuru_current_user', JSON.stringify(data.user));
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, token: data.token };
        } catch (error) {
            return { success: false, message: error.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('zuru_current_user');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

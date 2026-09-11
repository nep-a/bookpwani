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
            const res = await eventService.login(email, password);
            localStorage.setItem('token', res.token);
            localStorage.setItem('zuru_current_user', JSON.stringify(res.user));
            localStorage.setItem('user', JSON.stringify(res.user));
            setUser(res.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    };

    const register = async (username, email, password, role, hostType) => {
        try {
            const res = await eventService.register(username, email, password, role, hostType);
            localStorage.setItem('token', res.token);
            localStorage.setItem('zuru_current_user', JSON.stringify(res.user));
            localStorage.setItem('user', JSON.stringify(res.user));
            setUser(res.user);
            return { success: true, token: res.token };
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

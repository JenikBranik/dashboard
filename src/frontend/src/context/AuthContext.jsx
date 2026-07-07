import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                // Check if a valid session/cookie exists
                const data = await api.get('/api/auth/me');
                setUser(data.user);
            } catch (err) {
                // Expected if no cookie or invalid
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const data = await api.post('/api/auth/login', { email, password });
        setUser(data.user);
    };

    const register = async (username, email, password) => {
        const data = await api.post('/api/auth/register', { username, email, password });
        // After register, you might auto-login or simply return true depending on flow
        // The API returns 201 Created but doesn't set cookie automatically. We should login.
        if (data.user) {
            await login(email, password);
        }
    };

    const logout = async () => {
        await api.post('/api/auth/logout');
        setUser(null);
    };

    if (isLoading) {
        // Render a basic loading state while checking the cookie on initial boot
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

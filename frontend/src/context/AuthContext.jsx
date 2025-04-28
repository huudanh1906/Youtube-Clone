import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const userData = await AuthService.login(username, password);
            setCurrentUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(null);
    };

    const register = async (username, email, password) => {
        try {
            return await AuthService.register(username, email, password);
        } catch (error) {
            throw error;
        }
    };

    const value = {
        currentUser,
        loading,
        login,
        logout,
        register,
        isLoggedIn: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 
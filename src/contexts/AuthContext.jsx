import { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUser = getStoredAuth();
		if (storedUser) {
			setUser(storedUser);
		}
		setLoading(false);
	}, []);

	const login = (userData) => {
		setUser(userData);
	};

	const logout = () => {
		setUser(null);
		logoutService();
	};

	const hasRole = (role) => {
		return user?.roles?.includes(role);
	};

	if (loading) {
		return null; // Or a loading spinner
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, hasRole }}>
			{children}
		</AuthContext.Provider>
	);
};
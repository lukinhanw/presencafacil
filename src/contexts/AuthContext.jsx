import { createContext, useContext, useState, useEffect } from 'react';
import { 
	getStoredAuth, 
	removeStoredAuth, 
	setStoredAuth,
	login as loginService
} from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = getStoredAuth();
		if (storedUser) {
			setUser(storedUser);
		}
		setLoading(false);
	}, []);

	const login = async (credentials) => {
		try {
			const userData = await loginService(credentials);
			setUser(userData);
			navigate('/');
			return true;
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		setUser(null);
		removeStoredAuth();
		navigate('/login');
	};

	const hasRole = (role) => {
		return user?.roles?.includes(role);
	};

	const updateUserData = (newData) => {
		try {
			const updatedUser = { ...user, ...newData };
			setUser(updatedUser);
			setStoredAuth(updatedUser);
		} catch (error) {
			console.error('Erro ao atualizar dados do usuário:', error);
		}
	};

	if (loading) {
		return null; // Ou um componente de loading
	}

	return (
		<AuthContext.Provider value={{
			user,
			login,
			logout,
			hasRole,
			updateUserData
		}}>
			{children}
		</AuthContext.Provider>
	);
};
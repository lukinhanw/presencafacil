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
	const [authState, setAuthState] = useState({
		user: null,
		token: null,
		initialized: false,
		loading: true
	});
	const navigate = useNavigate();

	useEffect(() => {
		const storedAuth = getStoredAuth();
		if (storedAuth) {
			setAuthState({
				user: storedAuth.user,
				token: storedAuth.token,
				initialized: true,
				loading: false
			});
		} else {
			setAuthState(prev => ({
				...prev,
				initialized: true,
				loading: false
			}));
		}
	}, []);

	const login = async (credentials) => {
		try {
			const userData = await loginService(credentials);
			const storedAuth = getStoredAuth();
			setAuthState({
				user: storedAuth.user,
				token: storedAuth.token,
				initialized: true,
				loading: false
			});
			return storedAuth.user;
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		setAuthState({
			user: null,
			token: null,
			initialized: true,
			loading: false
		});
		removeStoredAuth();
		navigate('/login');
	};

	const updateUserData = (newData) => {
		try {
			const updatedUser = { ...authState.user, ...newData };
			setAuthState(prev => ({
				...prev,
				user: updatedUser
			}));
			setStoredAuth({ user: updatedUser, token: authState.token });
		} catch (error) {
			console.error('Erro ao atualizar dados do usuário:', error);
		}
	};

	if (authState.loading) {
		return null;
	}

	return (
		<AuthContext.Provider value={{
			user: authState.user,
			token: authState.token,
			login,
			logout,
			updateUserData,
			isAuthenticated: !!authState.token,
			initialized: authState.initialized,
			hasRole: (role) => authState.user?.roles?.includes(role)
		}}>
			{children}
		</AuthContext.Provider>
	);
};
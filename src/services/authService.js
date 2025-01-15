const AUTH_KEY = '@presenca:auth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const setStoredAuth = (userData) => {
	localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
};

export const getStoredAuth = () => {
	const storedData = localStorage.getItem(AUTH_KEY);
	return storedData ? JSON.parse(storedData) : null;
};

export const removeStoredAuth = () => {
	localStorage.removeItem(AUTH_KEY);
};

export const login = async (credentials) => {
	try {
		const response = await fetch(`${API_URL}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao fazer login');
		}

		const data = await response.json();
		
		// Armazena os dados do usuário e o token
		const authData = {
			...data.user,
			token: data.token
		};
		
		setStoredAuth(authData);
		return authData;
	} catch (error) {
		throw error;
	}
};

export const logout = () => {
	removeStoredAuth();
};
const AUTH_KEY = '@presenca:auth';
const TOKEN_KEY = 'token';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const setStoredAuth = (userData) => {
	localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
	// Armazena o token separadamente para fácil acesso
	if (userData.token) {
		localStorage.setItem(TOKEN_KEY, userData.token);
	}
};

export const getStoredAuth = () => {
	const storedData = localStorage.getItem(AUTH_KEY);
	return storedData ? JSON.parse(storedData) : null;
};

export const removeStoredAuth = () => {
	localStorage.removeItem(AUTH_KEY);
	localStorage.removeItem(TOKEN_KEY);
};

export const login = async (credentials) => {
	try {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(credentials)
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Erro ao fazer login');
		}

		// Armazena os dados do usuário e o token
		setStoredAuth(data);
		
		return data.user;
	} catch (error) {
		throw new Error(error.message || 'Erro ao fazer login');
	}
};

export const logout = () => {
	removeStoredAuth();
};
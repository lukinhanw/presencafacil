const AUTH_KEY = '@presenca:auth';

// Mock de usuários
const MOCK_USERS = [
	{
		id: 1,
		name: 'Admin',
		email: 'admin@example.com',
		password: 'senha123',
		roles: ['ADMIN_ROLE'],
		position: 'Administrador do Sistema',
		unit: 'Matriz',
		registration: 'ADM001',
		avatar: null
	},
	{
		id: 2,
		name: 'Instrutor',
		email: 'instrutor@example.com',
		password: 'senha123',
		roles: ['INSTRUCTOR_ROLE'],
		position: 'Instrutor de Treinamentos',
		unit: 'Filial 1',
		registration: 'INS001',
		avatar: null
	}
];

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
	// Simula uma chamada à API
	await new Promise(resolve => setTimeout(resolve, 500));

	// Encontra o usuário com as credenciais fornecidas
	const user = MOCK_USERS.find(u => 
		u.email === credentials.email && 
		u.password === credentials.password
	);

	if (!user) {
		throw new Error('Credenciais inválidas');
	}

	// Remove a senha antes de retornar os dados do usuário
	const { password, ...userWithoutPassword } = user;
	
	// Armazena os dados do usuário
	setStoredAuth(userWithoutPassword);
	
	return userWithoutPassword;
};

export const logout = () => {
	removeStoredAuth();
};
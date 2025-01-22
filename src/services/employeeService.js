const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'token';

const getAuthHeader = () => {
	const auth = JSON.parse(localStorage.getItem('@presenca:auth'));
	if (!auth || !auth.token) {
		throw new Error('Usuário não autenticado');
	}
	return {
		'Authorization': `Bearer ${auth.token}`,
		'Content-Type': 'application/json'
	};
};

const handleErrorResponse = async (response) => {
	const data = await response.json();
	
	// Caso 1: Erros de validação do express-validator
	if (data.errors && Array.isArray(data.errors)) {
		throw new Error(data.errors.map(err => err.msg).join(', '));
	}
	
	// Caso 2: Erro específico com mensagem e error
	if (data.error) {
		throw new Error(data.error);
	}
	
	// Caso 3: Apenas mensagem de erro
	if (data.message) {
		throw new Error(data.message);
	}
	
	// Caso padrão
	throw new Error('Erro na operação');
};

export const UNITS = [
	'Matriz',
	'Filial SP',
	'Filial RJ',
	'Filial MG',
	'Filial RS'
];

export const POSITIONS = [
	'Desenvolvedor Junior',
	'Desenvolvedor Pleno',
	'Desenvolvedor Senior',
	'Analista de RH',
	'Analista Financeiro',
	'Gerente de Projetos',
	'Coordenador',
	'Diretor'
];

export const getEmployees = async (filters = {}) => {
	const params = new URLSearchParams();
	
	if (filters.search) {
		params.append('search', filters.search);
	}
	
	if (filters.units?.length > 0) {
		params.append('units', filters.units.join(','));
	}
	
	if (filters.positions?.length > 0) {
		params.append('positions', filters.positions.join(','));
	}

	const response = await fetch(`${API_URL}/employees?${params}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};

export const createEmployee = async (data) => {
	const response = await fetch(`${API_URL}/employees`, {
		method: 'POST',
		headers: getAuthHeader(),
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};

export const updateEmployee = async (id, data) => {
	const response = await fetch(`${API_URL}/employees/${id}`, {
		method: 'PUT',
		headers: getAuthHeader(),
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};

export const deleteEmployee = async (id) => {
	const response = await fetch(`${API_URL}/employees/${id}`, {
		method: 'DELETE',
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}
};

export const searchEmployees = async (query) => {
	if (!query || query.length < 2) return [];

	const response = await fetch(`${API_URL}/employees/search?q=${encodeURIComponent(query)}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};

export const getEmployeeByRegistration = async (registration) => {
	const response = await fetch(`${API_URL}/employees/registration/${registration}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Erro ao buscar funcionário');
	}

	return await response.json();
};

export const getEmployeeByCardNumber = async (cardNumber) => {
	const response = await fetch(`${API_URL}/employees/card/${encodeURIComponent(cardNumber)}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};
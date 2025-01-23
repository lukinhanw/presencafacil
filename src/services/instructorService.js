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
	'Instrutor Junior',
	'Instrutor Pleno',
	'Instrutor Senior',
	'Coordenador de Treinamento',
	'Especialista em Treinamento'
];

export const getInstructors = async (filters = {}) => {
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

	if (filters.isActive !== undefined) {
		params.append('isActive', filters.isActive);
	}

	const response = await fetch(`${API_URL}/instructors?${params}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	const data = await response.json();
	return data.data || [];
};

export const createInstructor = async (data) => {
	const response = await fetch(`${API_URL}/instructors`, {
		method: 'POST',
		headers: getAuthHeader(),
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};

export const updateInstructor = async (id, data) => {
	const response = await fetch(`${API_URL}/instructors/${id}`, {
		method: 'PUT',
		headers: getAuthHeader(),
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};

export const deleteInstructor = async (id) => {
	const response = await fetch(`${API_URL}/instructors/${id}`, {
		method: 'DELETE',
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}
};

export const searchInstructors = async (query) => {
	if (!query || query.length < 2) return [];

	const response = await fetch(`${API_URL}/instructors/search?q=${encodeURIComponent(query)}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};

export const toggleInstructorStatus = async (id) => {
	const response = await fetch(`${API_URL}/instructors/${id}/toggle-status`, {
		method: 'PATCH',
		headers: getAuthHeader()
	});

	if (!response.ok) {
		await handleErrorResponse(response);
	}

	return await response.json();
};
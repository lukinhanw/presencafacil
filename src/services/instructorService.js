const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
import { getStoredAuth } from './authService';

// Helper para obter o cabeçalho de autenticação
const getAuthHeader = () => {
	const auth = getStoredAuth();
	return auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {};
};

export const getInstructors = async (filters = {}) => {
	try {
		// Constrói os parâmetros da query
		const queryParams = new URLSearchParams();
		if (filters.search) queryParams.append('search', filters.search);
		if (filters.unit) queryParams.append('unit', filters.unit);
		if (filters.position) queryParams.append('position', filters.position);
		if (filters.page) queryParams.append('page', filters.page);
		if (filters.limit) queryParams.append('limit', filters.limit);

		const response = await fetch(`${API_URL}/instructors?${queryParams}`, {
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar instrutores');
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		throw error;
	}
};

export const createInstructor = async (instructorData) => {
	try {
		const response = await fetch(`${API_URL}/instructors`, {
			method: 'POST',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(instructorData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao criar instrutor');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const updateInstructor = async (id, instructorData) => {
	try {
		const response = await fetch(`${API_URL}/instructors/${id}`, {
			method: 'PUT',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(instructorData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao atualizar instrutor');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const deleteInstructor = async (id) => {
	try {
		const response = await fetch(`${API_URL}/instructors/${id}`, {
			method: 'DELETE',
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao excluir instrutor');
		}
	} catch (error) {
		throw error;
	}
};

export const getInstructorUnits = async () => {
	try {
		const response = await fetch(`${API_URL}/instructors/units`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar unidades');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const getInstructorPositions = async () => {
	try {
		const response = await fetch(`${API_URL}/instructors/positions`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar cargos');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};
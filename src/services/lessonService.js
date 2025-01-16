const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
import { getStoredAuth } from './authService';

// Helper para obter o cabeçalho de autenticação
const getAuthHeader = () => {
	const auth = getStoredAuth();
	return auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {};
};

export const CLASS_TYPES = [
	{ value: 'Portfolio', label: 'Portfólio' },
	{ value: 'External', label: 'Externos' },
	{ value: 'DDS', label: 'DDS' },
	{ value: 'Others', label: 'Outros' }
];

export const getClasses = async (filters = {}) => {
	try {
		// Constrói os parâmetros da query
		const queryParams = new URLSearchParams();
		if (filters.search) queryParams.append('search', filters.search);
		if (filters.types?.length > 0) queryParams.append('types', filters.types.join(','));
		if (filters.units?.length > 0) queryParams.append('units', filters.units.join(','));
		if (filters.instructor_id) queryParams.append('instructor_id', filters.instructor_id);
		if (filters.start_date) queryParams.append('start_date', filters.start_date);
		if (filters.end_date) queryParams.append('end_date', filters.end_date);
		if (filters.page) queryParams.append('page', filters.page);
		if (filters.limit) queryParams.append('limit', filters.limit);

		const response = await fetch(`${API_URL}/lessons?${queryParams}`, {
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar aulas');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const createClass = async (classData) => {
	try {
		const response = await fetch(`${API_URL}/lessons`, {
			method: 'POST',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(classData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao criar aula');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const updateClass = async (id, classData) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${id}`, {
			method: 'PUT',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(classData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao atualizar aula');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const deleteClass = async (id) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${id}`, {
			method: 'DELETE',
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao excluir aula');
		}
	} catch (error) {
		throw error;
	}
};

export const removeAttendee = async (classId, attendeeId) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${classId}/attendees/${attendeeId}`, {
			method: 'DELETE',
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao remover participante');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const updateEarlyLeave = async (classId, attendeeId) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${classId}/early-leave`, {
			method: 'POST',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ employee_id: attendeeId })
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao registrar saída antecipada');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const registerAttendance = async (classId, attendeeData) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${classId}/attendance`, {
			method: 'POST',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ employee_id: attendeeData.id })
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao registrar presença');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const getClassById = async (id) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${id}`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar aula');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const finishClass = async (id) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${id}/finish`, {
			method: 'POST',
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao finalizar aula');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const cancelClass = async (id) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${id}/cancel`, {
			method: 'POST',
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao cancelar aula');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const getUnits = async () => {
	try {
		const response = await fetch(`${API_URL}/lessons/units`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar unidades');
		}

		const units = await response.json();
		return units.map(unit => ({
			value: unit,
			label: unit
		}));
	} catch (error) {
		throw error;
	}
}; 
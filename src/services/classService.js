const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
import { getStoredAuth } from './authService';

// Helper para obter o cabeçalho de autenticação
const getAuthHeader = () => {
	const auth = getStoredAuth();
	return {
		'Authorization': `Bearer ${auth?.token}`,
		'Content-Type': 'application/json'
	};
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
		if (filters.types?.length > 0) {
			queryParams.append('types', filters.types.map(t => t.value).join(','));
		}
		if (filters.units?.length > 0) {
			queryParams.append('units', filters.units.map(u => u.value).join(','));
		}
		if (filters.startDate) queryParams.append('start_date', filters.startDate);
		if (filters.endDate) queryParams.append('end_date', filters.endDate);
		if (filters.instructor) queryParams.append('instructor_id', filters.instructor);
		if (filters.provider) queryParams.append('provider', filters.provider);
		if (filters.page) queryParams.append('page', filters.page);
		if (filters.limit) queryParams.append('limit', filters.limit);

		const response = await fetch(`${API_URL}/lessons?${queryParams}`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar aulas');
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Erro em getClasses:', error);
		throw error;
	}
};

export const getClassById = async (id) => {
	try {
		console.log('Buscando aula com id:', id);
		const response = await fetch(`${API_URL}/lessons/${id}`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Aula não encontrada');
		}

		const data = await response.json();
		console.log('Aula encontrada:', data);
		return data;
	} catch (error) {
		console.error('Erro em getClassById:', error);
		throw error;
	}
};

export const createClass = async (classData) => {
	try {
		const response = await fetch(`${API_URL}/lessons`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify(classData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao criar aula');
		}

		return response.json();
	} catch (error) {
		console.error('Erro em createClass:', error);
		throw error;
	}
};

export const updateClass = async (id, classData) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${id}`, {
			method: 'PUT',
			headers: getAuthHeader(),
			body: JSON.stringify(classData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao atualizar aula');
		}

		return response.json();
	} catch (error) {
		console.error('Erro em updateClass:', error);
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
		console.error('Erro em deleteClass:', error);
		throw error;
	}
};

export const registerAttendance = async (classId, attendeeData) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${classId}/attendance`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify(attendeeData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao registrar presença');
		}

		return response.json();
	} catch (error) {
		console.error('Erro em registerAttendance:', error);
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
	} catch (error) {
		console.error('Erro em removeAttendee:', error);
		throw error;
	}
};

export const updateEarlyLeave = async (classId, attendeeId) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${classId}/early-leave`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify({ attendee_id: attendeeId })
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao registrar saída antecipada');
		}

		return response.json();
	} catch (error) {
		console.error('Erro em updateEarlyLeave:', error);
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

		return response.json();
	} catch (error) {
		console.error('Erro em finishClass:', error);
		throw error;
	}
};

export const generateInviteLink = async (classId) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${classId}/invite`, {
			method: 'POST',
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao gerar link de convite');
		}

		const { token } = await response.json();
		return `${window.location.origin}/aulas/${classId}/join/${token}`;
	} catch (error) {
		console.error('Erro em generateInviteLink:', error);
		throw error;
	}
};

export const validateInviteToken = async (classId, token) => {
	try {
		const response = await fetch(`${API_URL}/lessons/${classId}/validate-token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ token })
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Token inválido');
		}

		return true;
	} catch (error) {
		console.error('Erro em validateInviteToken:', error);
		throw error;
	}
};
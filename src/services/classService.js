const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CLASS_TYPES = [
	{ value: 'Portfolio', label: 'Portfólio' },
	{ value: 'External', label: 'Externos' },
	{ value: 'DDS', label: 'DDS' },
	{ value: 'Others', label: 'Outros' }
];

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

const handleResponse = async (response) => {
	if (!response.ok) {
		const data = await response.json();
		
		// Se houver erros de validação
		if (data.errors && Array.isArray(data.errors)) {
			throw new Error(data.errors.map(err => err.message || err).join(', '));
		}
		
		// Se houver uma mensagem de erro específica no campo error
		if (data.error) {
			throw new Error(data.error);
		}
		
		// Se houver uma mensagem de erro genérica
		if (data.message) {
			throw new Error(data.message);
		}
		
		throw new Error('Ocorreu um erro na operação');
	}
	
	return response.status !== 204 ? response.json() : null;
};

export const getClasses = async (filters = {}) => {
	try {
		const params = new URLSearchParams();

		if (filters.search) {
			params.append('search', filters.search);
		}

		if (filters.types?.length > 0) {
			const validTypes = filters.types.filter(t => t !== null).map(t => {
				// Se já for um objeto com value, usa o value
				if (typeof t === 'object' && t.value) return t.value;
				// Se for uma string, usa a string diretamente
				if (typeof t === 'string') return t;
				return null;
			}).filter(t => t !== null);
			
			if (validTypes.length > 0) {
				const typesParam = JSON.stringify(validTypes);
				params.append('types', typesParam);
			}
		}

		if (filters.units?.length > 0) {
			const validUnits = filters.units.filter(u => u !== null).map(u => {
				// Se já for um objeto com value, usa o value
				if (typeof u === 'object' && u.value) return u.value;
				// Se for uma string, usa a string diretamente
				if (typeof u === 'string') return u;
				return null;
			}).filter(u => u !== null);
			
			if (validUnits.length > 0) {
				const unitsParam = JSON.stringify(validUnits);
				params.append('units', unitsParam);
			}
		}

		const url = `${API_URL}/classes?${params}`;

		const response = await fetch(url, {
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao buscar aulas:', error);
		throw error;
	}
};

export const createClass = async (data) => {
	try {
		const response = await fetch(`${API_URL}/classes`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify(data)
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao criar aula:', error);
		throw error;
	}
};

export const updateClass = async (id, data) => {
	try {
		const response = await fetch(`${API_URL}/classes/${id}`, {
			method: 'PUT',
			headers: getAuthHeader(),
			body: JSON.stringify(data)
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao atualizar aula:', error);
		throw error;
	}
};

export const deleteClass = async (id) => {
	try {
		const response = await fetch(`${API_URL}/classes/${id}`, {
			method: 'DELETE',
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao excluir aula:', error);
		throw error;
	}
};

export const getClassById = async (id) => {
	try {
		const response = await fetch(`${API_URL}/classes/${id}`, {
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao buscar aula:', error);
		throw error;
	}
};

// Funções temporárias para participantes (serão substituídas posteriormente por endpoints próprios)
export const removeAttendee = async (classId, registration) => {
	try {
		const response = await fetch(`${API_URL}/classes/${classId}/attendees/${registration}`, {
			method: 'DELETE',
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao remover participante:', error);
		throw error;
	}
};

export const updateEarlyLeave = async (classId, attendeeId) => {
	try {
		const response = await fetch(`${API_URL}/classes/${classId}/attendees/${attendeeId}/early-leave`, {
			method: 'POST',
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao registrar saída antecipada:', error);
		throw error;
	}
};

export const registerAttendance = async (classId, attendeeData) => {
	try {
		const response = await fetch(`${API_URL}/classes/${classId}/attendees`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify(attendeeData)
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao registrar presença:', error);
		throw error;
	}
};

export const registerEarlyLeave = async (classId, registration) => {
	try {
		const response = await fetch(`${API_URL}/classes/${classId}/attendees/${registration}/early-leave`, {
			method: 'POST',
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao registrar saída antecipada:', error);
		throw error;
	}
};

export const finishClass = async (classId) => {
	try {
		const response = await fetch(`${API_URL}/classes/${classId}/finish`, {
			method: 'POST',
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao finalizar aula:', error);
		throw error;
	}
};

export const generateInviteLink = async (classId, expiresInMinutes = 60) => {
	const response = await fetch(`${API_URL}/classes/${classId}/invite`, {
		method: 'POST',
		headers: getAuthHeader(),
		body: JSON.stringify({ expiresInMinutes })
	});

	if (!response.ok) {
		await handleResponse(response);
	}

	const data = await response.json();
	return data;
};

export const validateInviteToken = async (classId, token) => {
	const response = await fetch(`${API_URL}/classes/${classId}/invite/${token}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Erro ao validar token');
	}

	return await response.json();
};

export const registerAttendanceByCard = async (classId, cardId) => {
	try {
		// Simulação de dados do funcionário baseado no cartão
		const mockEmployee = {
			id: Math.floor(Math.random() * 1000),
			name: `Funcionário ${cardId}`,
			registration: `REG-${cardId}`,
			cardId,
			type: 'NFC'
		};

		return await registerAttendance(classId, mockEmployee);
	} catch (error) {
		console.error('Erro ao registrar presença por cartão:', error);
		throw error;
	}
};
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const PROVIDERS = [
	'Udemy',
	'Alura',
	'Coursera',
	'Pluralsight',
	'LinkedIn Learning'
];

export const CLASSIFICATIONS = [
	'Tecnologia',
	'Metodologia',
	'Soft Skills',
	'Liderança',
	'Compliance'
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
	const data = await response.json();
	
	if (!response.ok) {
		// Se houver erros de validação
		if (data.errors && Array.isArray(data.errors)) {
			throw new Error(data.errors.map(err => err.message || err).join(', '));
		}
		
		// Se houver uma mensagem de erro específica
		if (data.message) {
			throw new Error(data.message);
		}
		
		// Se houver um erro específico
		if (data.error) {
			throw new Error(data.error);
		}
		
		throw new Error('Ocorreu um erro na operação');
	}
	
	return data;
};

export const getTrainings = async (filters = {}) => {
	try {
		const params = new URLSearchParams();

		if (filters.search) {
			params.append('search', filters.search);
		}

		if (filters.providers?.length > 0) {
			params.append('providers', JSON.stringify(filters.providers));
		}

		if (filters.classifications?.length > 0) {
			params.append('classifications', JSON.stringify(filters.classifications));
		}

		const response = await fetch(`${API_URL}/trainings?${params}`, {
			headers: getAuthHeader()
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao buscar treinamentos:', error);
		throw error;
	}
};

export const createTraining = async (trainingData) => {
	try {
		const response = await fetch(`${API_URL}/trainings`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify(trainingData)
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao criar treinamento:', error);
		throw error;
	}
};

export const updateTraining = async (id, trainingData) => {
	try {
		const response = await fetch(`${API_URL}/trainings/${id}`, {
			method: 'PUT',
			headers: getAuthHeader(),
			body: JSON.stringify(trainingData)
		});

		return await handleResponse(response);
	} catch (error) {
		console.error('Erro ao atualizar treinamento:', error);
		throw error;
	}
};

export const deleteTraining = async (id) => {
	try {
		const response = await fetch(`${API_URL}/trainings/${id}`, {
			method: 'DELETE',
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.message || data.error || 'Erro ao excluir treinamento');
		}
	} catch (error) {
		console.error('Erro ao excluir treinamento:', error);
		throw error;
	}
};
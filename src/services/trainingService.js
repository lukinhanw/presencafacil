const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
import { getStoredAuth } from './authService';

// Helper para obter o cabeçalho de autenticação
const getAuthHeader = () => {
	const auth = getStoredAuth();
	return auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {};
};

export const getTrainings = async (filters = {}) => {
	try {
		// Constrói os parâmetros da query
		const queryParams = new URLSearchParams();
		if (filters.search) queryParams.append('search', filters.search);
		if (filters.provider) queryParams.append('provider', filters.provider);
		if (filters.classification) queryParams.append('classification', filters.classification);
		if (filters.page) queryParams.append('page', filters.page);
		if (filters.limit) queryParams.append('limit', filters.limit);

		const response = await fetch(`${API_URL}/trainings?${queryParams}`, {
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar treinamentos');
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		throw error;
	}
};

export const createTraining = async (trainingData) => {
	try {
		const response = await fetch(`${API_URL}/trainings`, {
			method: 'POST',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(trainingData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao criar treinamento');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const updateTraining = async (id, trainingData) => {
	try {
		const response = await fetch(`${API_URL}/trainings/${id}`, {
			method: 'PUT',
			headers: {
				...getAuthHeader(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(trainingData)
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao atualizar treinamento');
		}

		return await response.json();
	} catch (error) {
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
			const error = await response.json();
			throw new Error(error.error || 'Erro ao excluir treinamento');
		}
	} catch (error) {
		throw error;
	}
};

export const getTrainingProviders = async () => {
	try {
		const response = await fetch(`${API_URL}/trainings/providers`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar fornecedores');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export const getTrainingClassifications = async () => {
	try {
		const response = await fetch(`${API_URL}/trainings/classifications`, {
			headers: getAuthHeader()
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Erro ao buscar classificações');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};
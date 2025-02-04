const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const getConfig = async () => {
	try {
		const response = await fetch(`${API_URL}/config`);

		if (!response.ok) {
			await handleErrorResponse(response);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		throw new Error(error.message || 'Erro ao buscar configurações');
	}
};

export const updateConfig = async (configData) => {
	try {
		const response = await fetch(`${API_URL}/config`, {
			method: 'PUT',
			headers: getAuthHeader(),
			body: JSON.stringify(configData)
		});

		if (!response.ok) {
			await handleErrorResponse(response);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		throw new Error(error.message || 'Erro ao atualizar configurações');
	}
}; 
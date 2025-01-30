const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getConfiguracoes = async () => {
	try {
		const response = await fetch(`${API_URL}/configuracoes`);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Erro ao buscar configurações');
		}

		return data;
	} catch (error) {
		throw new Error(error.message || 'Erro ao buscar configurações');
	}
};

export const salvarConfiguracoes = async (configuracoes) => {
	try {
		const formData = new FormData();
		
		// Adiciona os campos básicos
		formData.append('titulo', configuracoes.titulo);

		// Adiciona o arquivo de logo se existir
		if (configuracoes.logo instanceof File) {
			formData.append('logo', configuracoes.logo);
		}

		const response = await fetch(`${API_URL}/configuracoes`, {
			method: 'POST',
			body: formData
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Erro ao salvar configurações');
		}

		return data;
	} catch (error) {
		throw new Error(error.message || 'Erro ao salvar configurações');
	}
}; 
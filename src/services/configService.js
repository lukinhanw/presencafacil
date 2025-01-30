// Simulação de dados iniciais
const dadosSimulados = {
	titulo: 'Lista de Presença Digital',
	logo: null
};

// Simula um atraso de rede
const simularAtraso = () => new Promise(resolve => setTimeout(resolve, 800));

// Função auxiliar para log com timestamp
const logOperacao = (operacao, mensagem, dados = null) => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] ConfigService - ${operacao}: ${mensagem}`);
	if (dados) {
		console.log('Dados:', dados);
	}
};

/**
 * Busca as configurações do sistema
 * @returns {Promise<Object>} Configurações do sistema
 */
export const getConfiguracoes = async () => {
	try {
		logOperacao('GET', 'Iniciando busca das configurações');
		
		// Simula atraso de rede
		await simularAtraso();
		
		// No futuro, substituir por chamada real à API
		const configuracoes = { ...dadosSimulados };
		
		logOperacao('GET', 'Configurações obtidas com sucesso', configuracoes);
		return configuracoes;
	} catch (error) {
		logOperacao('GET', `Erro ao buscar configurações: ${error.message}`);
		throw new Error('Erro ao buscar configurações');
	}
};

/**
 * Salva as configurações do sistema
 * @param {Object} configuracoes - Objeto com as configurações a serem salvas
 * @returns {Promise<Object>} Configurações atualizadas
 */
export const salvarConfiguracoes = async (configuracoes) => {
	try {
		logOperacao('SAVE', 'Iniciando salvamento das configurações', configuracoes);
		
		// Simula atraso de rede
		await simularAtraso();
		
		// Simula validação dos dados
		if (!configuracoes.titulo) {
			const erro = 'O título é obrigatório';
			logOperacao('SAVE', `Erro de validação: ${erro}`);
			throw new Error(erro);
		}

		// Atualiza os dados simulados
		Object.assign(dadosSimulados, {
			titulo: configuracoes.titulo,
			logo: configuracoes.logo instanceof File ? configuracoes.logo.name : configuracoes.logo
		});

		logOperacao('SAVE', 'Configurações salvas com sucesso', dadosSimulados);
		
		// No futuro, substituir por chamada real à API
		return { ...dadosSimulados };
	} catch (error) {
		logOperacao('SAVE', `Erro ao salvar configurações: ${error.message}`);
		throw new Error(error.message || 'Erro ao salvar configurações');
	}
}; 
const Config = require('../models/config.model');
const { uploadFile, deleteFile } = require('../utils/upload');

class ConfigService {
	async getConfig() {
		try {
			let config = await Config.findOne();
			
			if (!config) {
				config = await Config.create({
					titulo: 'Lista de Presença Digital'
				});
			}
			
			return config;
		} catch (error) {
			console.error('Erro ao buscar configurações:', error);
			throw error;
		}
	}

	async updateConfig(dados, logoFile) {
		try {
			let config = await this.getConfig();

			// Validação do título
			if (!dados.titulo) {
				const error = new Error('Título é obrigatório');
				error.statusCode = 400;
				throw error;
			}

			// Se enviou novo logo, faz upload e deleta o anterior
			if (logoFile) {
				if (config.logo) {
					await deleteFile(config.logo);
				}
				
				const logoPath = await uploadFile(logoFile, 'logos');
				dados.logo = logoPath;
			}

			// Atualiza os dados
			await config.update({
				titulo: dados.titulo,
				logo: dados.logo || config.logo
			});

			return await this.getConfig();
		} catch (error) {
			console.error('Erro ao atualizar configurações:', error);
			
			// Adiciona statusCode se não existir
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			
			throw error;
		}
	}
}

module.exports = new ConfigService(); 
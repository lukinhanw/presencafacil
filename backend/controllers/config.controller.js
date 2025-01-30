const configService = require('../services/config.service');

class ConfigController {
	async getConfig(req, res, next) {
		try {
			const config = await configService.getConfig();
			res.json(config);
		} catch (error) {
			console.error('Erro ao buscar configurações:', error);
			next(error);
		}
	}

	async updateConfig(req, res, next) {
		try {
			const dados = req.body;
			const logoFile = req.file;

			const config = await configService.updateConfig(dados, logoFile);
			res.json({
				message: 'Configurações atualizadas com sucesso',
				data: config
			});
		} catch (error) {
			console.error('Erro ao atualizar configurações:', error);
			next(error);
		}
	}
}

module.exports = new ConfigController(); 
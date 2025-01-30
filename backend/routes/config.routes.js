const express = require('express');
const { body } = require('express-validator');
const configController = require('../controllers/config.controller');
const { verifyToken, hasRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Validações
const configValidations = [
	body('titulo')
		.notEmpty().withMessage('Título é obrigatório')
		.trim()
];

// Rota pública para obter configurações
router.get('/', configController.getConfig);

// Rotas protegidas por autenticação e role ADMIN
router.use(verifyToken);
router.use(hasRole(['ADMIN_ROLE']));

// Atualizar configurações
router.post('/',
	upload.single('logo'),
	configValidations,
	configController.updateConfig
);

module.exports = router; 
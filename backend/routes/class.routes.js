const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const classController = require('../controllers/class.controller');
const { verifyToken, hasRole } = require('../middleware/auth');

// Validações comuns para criar/atualizar aulas
const classValidations = [
    body('type')
        .isIn(['Portfolio', 'External', 'DDS', 'Others'])
        .withMessage('Tipo de aula inválido'),
    body('date_start')
        .isISO8601()
        .withMessage('Data de início inválida'),
    body('unit')
        .notEmpty()
        .withMessage('Unidade é obrigatória'),
    body('name')
        .if(body('type').not().equals('Portfolio'))
        .notEmpty()
        .withMessage('Nome é obrigatório para aulas não-Portfolio'),
    body('duration')
        .if(body('type').equals('External'))
        .matches(/^([0-9]{2}):([0-9]{2})$/)
        .withMessage('Duração deve estar no formato HH:mm'),
    body('provider')
        .if(body('type').not().equals('Portfolio'))
        .notEmpty()
        .withMessage('Fornecedor é obrigatório para aulas não-Portfolio'),
    body('content')
        .if(body('type').not().equals('Portfolio'))
        .notEmpty()
        .withMessage('Conteúdo é obrigatório para aulas não-Portfolio'),
    body('classification')
        .if(body('type').not().equals('Portfolio'))
        .notEmpty()
        .withMessage('Classificação é obrigatória para aulas não-Portfolio'),
    body('objective')
        .if(body('type').not().equals('Portfolio'))
        .notEmpty()
        .withMessage('Objetivo é obrigatório para aulas não-Portfolio')
];

// Rotas
router.get('/', verifyToken, classController.getClasses);
router.get('/:id', verifyToken, classController.getClassById);

router.post('/', 
    verifyToken, 
    hasRole('ADMIN_ROLE'), 
    classValidations,
    classController.createClass
);

router.put('/:id', 
    verifyToken, 
    hasRole('ADMIN_ROLE'), 
    classValidations,
    classController.updateClass
);

router.delete('/:id', 
    verifyToken, 
    hasRole('ADMIN_ROLE'), 
    classController.deleteClass
);

module.exports = router; 
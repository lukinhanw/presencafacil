const express = require('express');
const { body } = require('express-validator');
const classController = require('../controllers/class.controller');
const { verifyToken, hasRole } = require('../middleware/auth');

const router = express.Router();

// Validações comuns
const classValidations = [
    body('name').optional().notEmpty().withMessage('Nome é obrigatório quando informado'),
    body('date_start').notEmpty().withMessage('Data de início é obrigatória'),
    body('unit').notEmpty().withMessage('Unidade é obrigatória'),
    body('type').isIn(['Portfolio', 'External', 'DDS', 'Others']).withMessage('Tipo inválido'),
    body('instructor').notEmpty().withMessage('Instrutor é obrigatório'),
    body('instructor.id').notEmpty().withMessage('ID do instrutor é obrigatório')
];

// Validações para registro de presença
const attendeeValidations = [
    body('name').notEmpty().withMessage('Nome do participante é obrigatório'),
    body('registration').notEmpty().withMessage('Matrícula do participante é obrigatória'),
    body('unit').notEmpty().withMessage('Unidade do participante é obrigatória')
];

// Rotas básicas
router.get('/', verifyToken, classController.getClasses);
router.get('/:id', verifyToken, classController.getClassById);
router.post('/', verifyToken, hasRole('ADMIN'), classValidations, classController.createClass);
router.put('/:id', verifyToken, hasRole('ADMIN'), classValidations, classController.updateClass);
router.delete('/:id', verifyToken, hasRole('ADMIN'), classController.deleteClass);

// Rotas para gerenciar participantes
router.post('/:id/attendees', verifyToken, attendeeValidations, classController.registerAttendance);
router.post('/:id/attendees/:registration/early-leave', verifyToken, classController.registerEarlyLeave);
router.delete('/:id/attendees/:registration', verifyToken, classController.removeAttendee);

// Rotas para gerenciar status da aula
router.post('/:id/finish', verifyToken, hasRole('ADMIN'), classController.finishClass);

// Rotas para convites
router.post('/:id/invite', verifyToken, hasRole('ADMIN'), classController.generateInviteLink);
router.get('/:id/invite/:token/validate', classController.validateInviteToken);

module.exports = router; 
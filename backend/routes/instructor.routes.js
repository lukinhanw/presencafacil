const express = require('express');
const { body } = require('express-validator');
const instructorController = require('../controllers/instructor.controller');
const { verifyToken, hasRole } = require('../middleware/auth');

const router = express.Router();

// Validações comuns para criação e atualização
const instructorValidations = [
    body('name')
        .notEmpty().withMessage('Nome é obrigatório')
        .trim(),
    body('registration')
        .notEmpty().withMessage('Matrícula é obrigatória')
        .trim(),
    body('unit')
        .notEmpty().withMessage('Unidade é obrigatória')
        .trim(),
    body('position')
        .notEmpty().withMessage('Cargo é obrigatório')
        .trim(),
    body('specialties')
        .isArray().withMessage('Especialidades deve ser um array')
        .notEmpty().withMessage('Pelo menos uma especialidade é obrigatória')
];

// Rotas protegidas por autenticação
router.use(verifyToken);

// Listar instrutores (com filtros)
router.get('/', instructorController.getInstructors);

// Buscar instrutores (para autocomplete)
router.get('/search', instructorController.searchInstructors);

// Buscar instrutor por ID
router.get('/:id', instructorController.getInstructorById);

// Rotas que requerem papel de ADMIN
router.use(hasRole(['ADMIN_ROLE']));

// Criar instrutor
router.post('/', instructorValidations, instructorController.createInstructor);

// Atualizar instrutor
router.put('/:id', instructorValidations, instructorController.updateInstructor);

// Excluir instrutor
router.delete('/:id', instructorController.deleteInstructor);

// Ativar/Desativar instrutor
router.patch('/:id/toggle-status', instructorController.toggleInstructorStatus);

module.exports = router; 
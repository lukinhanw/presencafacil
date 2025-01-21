const classService = require('../services/class.service');
const { validationResult } = require('express-validator');

class ClassController {
    async getClasses(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                types: req.query.types,
                units: req.query.units
            };
            
            const classes = await classService.getClasses(filters);
            res.json(classes);
        } catch (error) {
            console.error('Erro ao buscar aulas:', error);
            next(error);
        }
    }

    async getClassById(req, res, next) {
        try {
            const classData = await classService.getClassById(req.params.id);
            res.json(classData);
        } catch (error) {
            console.error('Erro ao buscar aula:', error);
            next(error);
        }
    }

    async createClass(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const classData = await classService.createClass(req.body);
            res.status(201).json(classData);
        } catch (error) {
            console.error('Erro ao criar aula:', error);
            next(error);
        }
    }

    async updateClass(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const classData = await classService.updateClass(req.params.id, req.body);
            res.json(classData);
        } catch (error) {
            console.error('Erro ao atualizar aula:', error);
            next(error);
        }
    }

    async deleteClass(req, res, next) {
        try {
            await classService.deleteClass(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar aula:', error);
            next(error);
        }
    }

    // Novos métodos para gerenciar participantes
    async registerAttendance(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const classData = await classService.registerAttendance(req.params.id, req.body);
            res.json(classData);
        } catch (error) {
            console.error('Erro ao registrar presença:', error);
            next(error);
        }
    }

    async registerEarlyLeave(req, res, next) {
        try {
            const classData = await classService.registerEarlyLeave(req.params.id, req.params.registration);
            res.json(classData);
        } catch (error) {
            console.error('Erro ao registrar saída antecipada:', error);
            next(error);
        }
    }

    async removeAttendee(req, res, next) {
        try {
            const classData = await classService.removeAttendee(req.params.id, req.params.registration);
            res.json(classData);
        } catch (error) {
            console.error('Erro ao remover participante:', error);
            next(error);
        }
    }

    async finishClass(req, res, next) {
        try {
            const classData = await classService.finishClass(req.params.id);
            res.json(classData);
        } catch (error) {
            console.error('Erro ao finalizar aula:', error);
            next(error);
        }
    }

    async generateInviteLink(req, res, next) {
        console.log('req', req);
        console.log('res', res);
        try {
            const { expiresInMinutes } = req.body;
            const inviteData = await classService.generateInviteLink(req.params.id, expiresInMinutes);
            res.json(inviteData);
        } catch (error) {
            console.error('Erro ao gerar link de convite:', error);
            next(error);
        }
    }

    async validateInviteToken(req, res, next) {
        try {
            const isValid = await classService.validateInviteToken(req.params.id, req.params.token);
            res.json({ valid: isValid });
        } catch (error) {
            console.error('Erro ao validar token:', error);
            next(error);
        }
    }
}

module.exports = new ClassController(); 
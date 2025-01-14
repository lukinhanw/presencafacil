const classService = require('../services/class.service');
const { validationResult } = require('express-validator');

class ClassController {
    async getClasses(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                types: req.query.types ? JSON.parse(req.query.types) : [],
                units: req.query.units ? JSON.parse(req.query.units) : []
            };

            const classes = await classService.getClasses(filters);
            res.json(classes);
        } catch (error) {
            next(error);
        }
    }

    async getClassById(req, res, next) {
        try {
            const classData = await classService.getClassById(req.params.id);
            res.json(classData);
        } catch (error) {
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
            next(error);
        }
    }

    async deleteClass(req, res, next) {
        try {
            await classService.deleteClass(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ClassController(); 
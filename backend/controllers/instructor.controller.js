const { validationResult } = require('express-validator');
const instructorService = require('../services/instructor.service');

class InstructorController {
    async getInstructors(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                units: req.query.units,
                positions: req.query.positions,
                specialties: req.query.specialties,
                isActive: req.query.isActive
            };

            const instructors = await instructorService.getInstructors(filters);
            res.json(instructors);
        } catch (error) {
            next(error);
        }
    }

    async createInstructor(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const instructor = await instructorService.createInstructor(req.body);
            res.status(201).json(instructor);
        } catch (error) {
            next(error);
        }
    }

    async updateInstructor(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const instructor = await instructorService.updateInstructor(req.params.id, req.body);
            res.json(instructor);
        } catch (error) {
            next(error);
        }
    }

    async deleteInstructor(req, res, next) {
        try {
            await instructorService.deleteInstructor(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async searchInstructors(req, res, next) {
        try {
            const instructors = await instructorService.searchInstructors(req.query.q);
            res.json(instructors);
        } catch (error) {
            next(error);
        }
    }

    async getInstructorById(req, res, next) {
        try {
            const instructor = await instructorService.getInstructorById(req.params.id);
            res.json(instructor);
        } catch (error) {
            next(error);
        }
    }

    async toggleInstructorStatus(req, res, next) {
        try {
            const instructor = await instructorService.toggleInstructorStatus(req.params.id);
            res.json(instructor);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new InstructorController(); 
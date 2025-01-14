const { Op } = require('sequelize');
const Instructor = require('../models/instructor.model');

class InstructorService {
    async getInstructors(filters = {}) {
        const where = {};

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { registration: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        if (filters.units) {
            const unitArray = typeof filters.units === 'string' ? 
                filters.units.split(',') : filters.units;
            
            if (unitArray.length > 0) {
                where.unit = { [Op.in]: unitArray };
            }
        }

        if (filters.positions) {
            const positionArray = typeof filters.positions === 'string' ? 
                filters.positions.split(',') : filters.positions;
            
            if (positionArray.length > 0) {
                where.position = { [Op.in]: positionArray };
            }
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive === 'true';
        }

        return await Instructor.findAll({ where });
    }

    async createInstructor(data) {
        const existingRegistration = await Instructor.findOne({
            where: { registration: data.registration }
        });

        if (existingRegistration) {
            throw new Error('Matrícula já cadastrada');
        }

        return await Instructor.create(data);
    }

    async updateInstructor(id, data) {
        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            throw new Error('Instrutor não encontrado');
        }

        const existingRegistration = await Instructor.findOne({
            where: {
                registration: data.registration,
                id: { [Op.ne]: id }
            }
        });

        if (existingRegistration) {
            throw new Error('Matrícula já cadastrada');
        }

        await instructor.update(data);
        return instructor;
    }

    async deleteInstructor(id) {
        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            throw new Error('Instrutor não encontrado');
        }

        await instructor.destroy();
    }

    async searchInstructors(query) {
        if (!query || query.length < 2) return [];

        return await Instructor.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { registration: { [Op.like]: `%${query}%` } }
                ],
                isActive: true
            },
            limit: 10
        });
    }

    async getInstructorById(id) {
        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            throw new Error('Instrutor não encontrado');
        }
        return instructor;
    }

    async toggleInstructorStatus(id) {
        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            throw new Error('Instrutor não encontrado');
        }

        await instructor.update({ isActive: !instructor.isActive });
        return instructor;
    }
}

module.exports = new InstructorService(); 
const { Op } = require('sequelize');
const Class = require('../models/class.model');
const Instructor = require('../models/instructor.model');

class ClassService {
    // Método auxiliar para formatar o tipo
    formatType(type) {
        switch (type) {
            case 'Portfolio': return 'Portfólio';
            case 'External': return 'Externo';
            case 'DDS': return 'DDS';
            case 'Others': return 'Outros';
            default: return type;
        }
    }

    async getClasses(filters = {}) {
        const where = {
            status: 'scheduled',
            date_end: null
        };

        // Filtro por texto (busca em nome, código)
        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { code: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        // Filtro por tipos
        if (filters.types && filters.types !== '') {
            try {
                let typesArray;
                // Se já for um array, usa direto
                if (Array.isArray(filters.types)) {
                    typesArray = filters.types;
                } else {
                    // Tenta fazer o parse apenas se for uma string não vazia
                    typesArray = JSON.parse(filters.types);
                }
                
                if (Array.isArray(typesArray) && typesArray.length > 0 && !typesArray.every(type => type === null)) {
                    where.type = { [Op.in]: typesArray.filter(type => type !== null) };
                }
            } catch (error) {
                console.error('Erro ao processar filtro de tipos:', error);
            }
        }

        // Filtro por unidades
        if (filters.units && filters.units !== '') {
            try {
                let unitsArray;
                // Se já for um array, usa direto
                if (Array.isArray(filters.units)) {
                    unitsArray = filters.units;
                } else {
                    // Tenta fazer o parse apenas se for uma string não vazia
                    unitsArray = JSON.parse(filters.units);
                }
                
                if (Array.isArray(unitsArray) && unitsArray.length > 0 && !unitsArray.every(unit => unit === null)) {
                    where.unit = { [Op.in]: unitsArray.filter(unit => unit !== null) };
                }
            } catch (error) {
                console.error('Erro ao processar filtro de unidades:', error);
            }
        }

        try {
            const classes = await Class.findAll({
                where,
                include: [{
                    model: Instructor,
                    as: 'instructor',
                    attributes: ['id', 'name', 'registration', 'unit', 'position']
                }],
                order: [['date_start', 'DESC']]
            });

            // Formatar os dados para o formato esperado pelo frontend
            return classes.map(classItem => ({
                id: classItem.id,
                type: this.formatType(classItem.type),
                originalType: classItem.type, // Mantemos o tipo original para edição
                date_start: classItem.date_start,
                date_end: classItem.date_end,
                presents: classItem.presents,
                status: classItem.status,
                unit: classItem.unit,
                training: {
                    name: classItem.name,
                    code: classItem.code,
                    duration: classItem.duration,
                    provider: classItem.provider,
                    content: classItem.content,
                    classification: classItem.classification,
                    objective: classItem.objective
                },
                instructor: classItem.instructor ? {
                    id: classItem.instructor.id,
                    name: classItem.instructor.name,
                    registration: classItem.instructor.registration,
                    unit: classItem.instructor.unit,
                    position: classItem.instructor.position
                } : null
            }));
        } catch (error) {
            console.error('Erro ao buscar aulas:', error);
            throw new Error('Erro ao buscar aulas');
        }
    }

    async getClassById(id) {
        try {
            const classData = await Class.findByPk(id, {
                include: [{
                    model: Instructor,
                    as: 'instructor',
                    attributes: ['id', 'name', 'registration', 'unit', 'position']
                }]
            });
            
            if (!classData) {
                throw new Error('Aula não encontrada');
            }

            // Formatar os dados para o formato esperado pelo frontend
            return {
                id: classData.id,
                type: this.formatType(classData.type),
                originalType: classData.type, // Mantemos o tipo original para edição
                date_start: classData.date_start,
                date_end: classData.date_end,
                presents: classData.presents,
                status: classData.status,
                unit: classData.unit,
                training: {
                    name: classData.name,
                    code: classData.code,
                    duration: classData.duration,
                    provider: classData.provider,
                    content: classData.content,
                    classification: classData.classification,
                    objective: classData.objective
                },
                instructor: classData.instructor ? {
                    id: classData.instructor.id,
                    name: classData.instructor.name,
                    registration: classData.instructor.registration,
                    unit: classData.instructor.unit,
                    position: classData.instructor.position
                } : null
            };
        } catch (error) {
            console.error('Erro ao buscar aula:', error);
            throw new Error('Erro ao buscar aula');
        }
    }

    async createClass(data) {
        try {
            console.log('Dados recebidos:', data);

            // Validações específicas por tipo
            if (data.type === 'Portfolio') {
                if (!data.training) {
                    throw new Error('Dados do treinamento são obrigatórios para tipo Portfolio');
                }
            } else {
                if (!data.name) {
                    throw new Error('Nome é obrigatório');
                }
            }

            // Validações comuns
            if (!data.date_start) {
                throw new Error('Data de início é obrigatória');
            }
            if (!data.unit) {
                throw new Error('Unidade é obrigatória');
            }
            if (!data.instructor || !data.instructor.id) {
                throw new Error('Instrutor é obrigatório');
            }

            // Preparar os dados para criação
            const classData = {
                type: data.type,
                date_start: data.date_start,
                presents: 0,
                status: 'scheduled',
                unit: data.unit,
                instructor_id: data.instructor.id,
                name: data.type === 'Portfolio' ? data.training.name : data.name,
                code: data.type === 'Portfolio' ? data.training.code : this.getCodeByType(data.type),
                duration: data.type === 'Portfolio' ? data.training.duration : 
                         data.type === 'DDS' ? '00:40' : (data.duration || ''),
                provider: data.type === 'Portfolio' ? data.training.provider : (data.provider || ''),
                content: data.type === 'Portfolio' ? data.training.content : (data.content || ''),
                classification: data.type === 'Portfolio' ? data.training.classification : (data.classification || ''),
                objective: data.type === 'Portfolio' ? data.training.objective : (data.objective || '')
            };

            console.log('Dados para criação:', classData);

            const newClass = await Class.create(classData);
            return this.getClassById(newClass.id);
        } catch (error) {
            console.error('Erro detalhado ao criar aula:', error);
            if (error.name === 'SequelizeValidationError') {
                const messages = error.errors.map(err => err.message).join(', ');
                throw new Error(`Erro de validação: ${messages}`);
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw new Error(`Erro ao criar aula: ${error.message}`);
            }
            throw error;
        }
    }

    async updateClass(id, data) {
        try {
            const classToUpdate = await Class.findByPk(id);
            if (!classToUpdate) {
                throw new Error('Aula não encontrada');
            }

            // Não permitir atualização de aulas finalizadas
            if (classToUpdate.status === 'completed') {
                throw new Error('Não é possível atualizar uma aula finalizada');
            }

            await classToUpdate.update(data);
            return this.getClassById(id);
        } catch (error) {
            console.error('Erro ao atualizar aula:', error);
            throw error;
        }
    }

    async deleteClass(id) {
        try {
            const classToDelete = await Class.findByPk(id);
            if (!classToDelete) {
                throw new Error('Aula não encontrada');
            }

            // Não permitir exclusão de aulas finalizadas
            if (classToDelete.status === 'completed') {
                throw new Error('Não é possível excluir uma aula finalizada');
            }

            await classToDelete.destroy();
        } catch (error) {
            console.error('Erro ao excluir aula:', error);
            throw error;
        }
    }

    getCodeByType(type) {
        switch (type) {
            case 'External': return 'EXT';
            case 'DDS': return 'DDS';
            case 'Others': return 'OUTROS';
            default: return '';
        }
    }
}

module.exports = new ClassService(); 
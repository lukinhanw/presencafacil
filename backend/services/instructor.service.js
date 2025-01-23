const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const Instructor = require('../models/instructor.model');
const User = require('../models/user.model');
const Class = require('../models/class.model');
const sequelize = require('../config/database');

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

        console.log('[Instrutor] Buscando instrutores com filtros:', {
            ...filters,
            whereClause: where
        });

        const instructors = await Instructor.findAll({ where });
        console.log(`[Instrutor] Total de instrutores encontrados: ${instructors.length}`);
        
        return instructors;
    }

    async create(instructorData) {
        const transaction = await sequelize.transaction();
        console.log('Iniciando criação do instrutor com os dados:', instructorData);

        try {
            // Verificar se já existe instrutor ou usuário com a mesma matrícula
            console.log('Verificando se matrícula já existe...');
            const existingInstructor = await Instructor.findOne({
                where: { registration: instructorData.registration }
            });

            const existingUser = await User.findOne({
                where: { registration: instructorData.registration }
            });

            if (existingInstructor || existingUser) {
                throw new Error('Já existe um instrutor ou usuário com esta matrícula');
            }

            // Verificar se já existe usuário com o mesmo email
            console.log('Verificando se email já existe...');
            const existingEmail = await User.findOne({
                where: { email: instructorData.email }
            });

            if (existingEmail) {
                throw new Error('Já existe um usuário com este email');
            }

            // Gerar hash da senha
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(instructorData.registration, salt);

            // Criar o instrutor com a senha
            console.log('Tentando criar instrutor...');
            const instructor = await Instructor.create({
                ...instructorData,
                password: hashedPassword
            }, { transaction });
            console.log('Instrutor criado com sucesso:', instructor.toJSON());

            // Criar o usuário correspondente
            const userData = {
                name: instructorData.name,
                email: instructorData.email,
                password: instructorData.registration, // O hook do modelo User vai criptografar
                roles: ['INSTRUCTOR_ROLE'],
                position: instructorData.position,
                unit: instructorData.unit,
                registration: instructorData.registration
            };
            console.log('Tentando criar usuário com os dados:', { ...userData, password: '***' });

            const user = await User.create(userData, { transaction });
            console.log('Usuário criado com sucesso:', { 
                ...user.toJSON(),
                password: '***'
            });

            console.log('Commitando transação...');
            await transaction.commit();
            console.log('Transação commitada com sucesso');
            
            return instructor;
        } catch (error) {
            console.error('Erro durante a criação:', error);
            if (transaction) {
                console.log('Fazendo rollback da transação...');
                await transaction.rollback();
                console.log('Rollback concluído');
            }
            throw error;
        }
    }

    async update(id, instructorData) {
        const transaction = await sequelize.transaction();

        try {
            const instructor = await Instructor.findByPk(id);
            if (!instructor) {
                throw new Error('Instrutor não encontrado');
            }

            // Atualizar o instrutor
            await instructor.update(instructorData, { transaction });

            // Atualizar o usuário correspondente
            const user = await User.findOne({ 
                where: { registration: instructor.registration },
                transaction 
            });

            if (user) {
                await user.update({
                    name: instructorData.name,
                    email: instructorData.email,
                    position: instructorData.position,
                    unit: instructorData.unit
                }, { transaction });
            }

            await transaction.commit();
            return instructor;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }

    async delete(id) {
        const transaction = await sequelize.transaction();
        console.log('Iniciando exclusão do instrutor ID:', id);

        try {
            const instructor = await Instructor.findByPk(id);
            if (!instructor) {
                console.log('Instrutor não encontrado com ID:', id);
                throw new Error('Instrutor não encontrado');
            }
            console.log('Instrutor encontrado:', instructor.toJSON());

            // Verificar se existem aulas associadas
            const classesCount = await Class.count({
                where: { instructor_id: id }
            });

            if (classesCount > 0) {
                throw new Error(`Não é possível excluir o instrutor pois existem ${classesCount} aulas associadas a ele. Considere desativar o instrutor em vez de excluí-lo.`);
            }

            // Encontrar o usuário associado
            console.log('Buscando usuário associado com matrícula:', instructor.registration);
            const user = await User.findOne({ 
                where: { registration: instructor.registration },
                transaction 
            });

            if (user) {
                console.log('Usuário encontrado:', { ...user.toJSON(), password: '***' });
                console.log('Excluindo usuário...');
                await user.destroy({ transaction });
                console.log('Usuário excluído com sucesso');
            } else {
                console.log('Nenhum usuário encontrado com esta matrícula');
            }

            // Excluir o instrutor
            console.log('Excluindo instrutor...');
            await instructor.destroy({ transaction });
            console.log('Instrutor excluído com sucesso');

            console.log('Commitando transação...');
            await transaction.commit();
            console.log('Transação commitada com sucesso');
            return true;
        } catch (error) {
            console.error('Erro durante a exclusão:', error);
            if (transaction) {
                console.log('Fazendo rollback da transação...');
                await transaction.rollback();
                console.log('Rollback concluído');
            }
            throw error;
        }
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
        const transaction = await sequelize.transaction();
        console.log('=== Início do Processo de Alteração de Status ===');
        console.log(`[${new Date().toISOString()}] Iniciando toggle de status do instrutor ID:`, id);

        try {
            const instructor = await Instructor.findByPk(id);
            if (!instructor) {
                console.log(`[${new Date().toISOString()}] Erro: Instrutor não encontrado com ID:`, id);
                throw new Error('Instrutor não encontrado');
            }
            
            const instructorData = instructor.toJSON();
            delete instructorData.password; // Remove senha dos logs
            console.log(`[${new Date().toISOString()}] Instrutor encontrado:`, instructorData);
            console.log(`[${new Date().toISOString()}] Status atual:`, instructor.isActive ? 'Ativo' : 'Inativo');

            // Atualizar o status do instrutor
            const newStatus = !instructor.isActive;
            console.log(`[${new Date().toISOString()}] Alterando status do instrutor para:`, newStatus ? 'Ativo' : 'Inativo');
            
            await instructor.update({ 
                isActive: newStatus 
            }, { transaction });
            console.log(`[${new Date().toISOString()}] Status do instrutor atualizado com sucesso`);

            // Atualizar o status do usuário correspondente
            console.log(`[${new Date().toISOString()}] Buscando usuário associado com matrícula:`, instructor.registration);
            const user = await User.findOne({ 
                where: { registration: instructor.registration },
                transaction 
            });

            if (user) {
                const userData = user.toJSON();
                delete userData.password; // Remove senha dos logs
                console.log(`[${new Date().toISOString()}] Usuário encontrado:`, userData);
                console.log(`[${new Date().toISOString()}] Atualizando status do usuário para:`, newStatus ? 'Ativo' : 'Inativo');
                
                await user.update({ 
                    isActive: newStatus 
                }, { transaction });
                console.log(`[${new Date().toISOString()}] Status do usuário atualizado com sucesso`);
            } else {
                console.log(`[${new Date().toISOString()}] Aviso: Nenhum usuário encontrado com a matrícula:`, instructor.registration);
            }

            console.log(`[${new Date().toISOString()}] Iniciando commit da transação...`);
            await transaction.commit();
            console.log(`[${new Date().toISOString()}] Transação commitada com sucesso`);
            console.log('=== Fim do Processo de Alteração de Status ===');
            return instructor;
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Erro durante o toggle de status:`, error);
            if (transaction) {
                console.log(`[${new Date().toISOString()}] Iniciando rollback da transação...`);
                await transaction.rollback();
                console.log(`[${new Date().toISOString()}] Rollback concluído`);
            }
            throw error;
        }
    }

    async findAll(query = {}) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Buscando todos os instrutores com query:`, query);
        
        const instructors = await Instructor.findAll({
            where: { ...query },
            order: [['name', 'ASC']]
        });
        
        console.log(`[${timestamp}] Total de instrutores encontrados: ${instructors.length}`);
        return instructors;
    }

    async findById(id) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Buscando instrutor por ID:`, id);
        
        const instructor = await Instructor.findOne({
            where: { id }
        });
        
        console.log(`[${timestamp}] Instrutor encontrado:`, instructor ? 'Sim' : 'Não');
        return instructor;
    }
}

module.exports = new InstructorService(); 
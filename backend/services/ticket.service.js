const { Op } = require('sequelize');
const Ticket = require('../models/ticket.model');
const TicketMessage = require('../models/ticketMessage.model');
const User = require('../models/user.model');
const uploadService = require('./upload.service');
const path = require('path');
const crypto = require('crypto');

class TicketService {
    formatTicketResponse(ticket) {
        const plainTicket = ticket.get({ plain: true });
        
        // Formatar datas ISO
        plainTicket.created_at = plainTicket.created_at?.toISOString();
        plainTicket.updated_at = plainTicket.updated_at?.toISOString();
        
        if (plainTicket.messages) {
            plainTicket.messages = plainTicket.messages.map(message => {
                const attachments = Array.isArray(message.attachments) ? message.attachments : [];
                return {
                    ...message,
                    created_at: message.created_at?.toISOString(),
                    updated_at: message.updated_at?.toISOString(),
                    attachments: attachments
                };
            });
        }
        
        return plainTicket;
    }

    async getTickets(filters = {}) {
        const where = {};

        if (filters.userId && !filters.isAdmin) {
            where.user_id = filters.userId;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.category) {
            where.category = filters.category;
        }

        if (filters.priority) {
            where.priority = filters.priority;
        }

        if (filters.userSearch) {
            const users = await User.findAll({
                where: {
                    name: { [Op.like]: `%${filters.userSearch}%` }
                }
            });
            where.user_id = { [Op.in]: users.map(u => u.id) };
        }

        const tickets = await Ticket.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                {
                    model: TicketMessage,
                    as: 'messages',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ],
            order: [['updated_at', 'DESC']]
        });

        return tickets.map(ticket => this.formatTicketResponse(ticket));
    }

    async getTicketById(id) {
        const ticket = await Ticket.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                {
                    model: TicketMessage,
                    as: 'messages',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name']
                        }
                    ],
                    order: [['created_at', 'ASC']]
                }
            ]
        });

        if (!ticket) {
            throw new Error('Ticket não encontrado');
        }

        return this.formatTicketResponse(ticket);
    }

    async createTicket(data) {
        const ticket = await Ticket.create({
            title: data.title,
            description: data.description,
            priority: data.priority,
            category: data.category,
            user_id: data.userId
        });

        // Processar anexos
        let attachments = [];
        if (data.attachments && data.attachments.length > 0) {
            attachments = await Promise.all(
                data.attachments.map(async file => {
                    // Gerar nome único para o arquivo
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const fileName = `ticket_${ticket.id}_${uniqueSuffix}${path.extname(file.originalname)}`;
                    
                    // Salvar arquivo usando o método existente
                    await uploadService.saveBase64Image(file.buffer.toString('base64'), `ticket_${ticket.id}`);
                    
                    return {
                        name: file.originalname,
                        url: `/api/uploads/${fileName}`
                    };
                })
            );
        }

        // Criar primeira mensagem com a descrição
        await TicketMessage.create({
            message: data.description,
            user_id: data.userId,
            ticket_id: ticket.id,
            is_support: false,
            attachments: attachments || []
        });

        return this.getTicketById(ticket.id);
    }

    async addMessage(ticketId, data) {
        const ticket = await this.getTicketById(ticketId);

        // Processar anexos
        let attachments = [];
        if (data.attachments && data.attachments.length > 0) {
            attachments = await Promise.all(
                data.attachments.map(async file => {
                    // Gerar nome único para o arquivo
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const fileName = `ticket_${ticketId}_${uniqueSuffix}${path.extname(file.originalname)}`;
                    
                    // Salvar arquivo usando o método existente
                    await uploadService.saveBase64Image(file.buffer.toString('base64'), `ticket_${ticketId}`);
                    
                    return {
                        name: file.originalname,
                        url: `/api/uploads/${fileName}`
                    };
                })
            );
        }

        await TicketMessage.create({
            message: data.message,
            user_id: data.userId,
            ticket_id: ticketId,
            is_support: data.isSupport,
            attachments: attachments || []
        });

        // Atualizar o timestamp do ticket
        await ticket.update({ updated_at: new Date() });

        return this.getTicketById(ticketId);
    }

    async updateTicketStatus(ticketId, status) {
        const ticket = await this.getTicketById(ticketId);
        
        if (!['open', 'in-progress', 'closed'].includes(status)) {
            throw new Error('Status inválido');
        }

        await ticket.update({ status });
        return this.getTicketById(ticketId);
    }
}

module.exports = new TicketService(); 
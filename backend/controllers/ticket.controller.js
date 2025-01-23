const { validationResult } = require('express-validator');
const ticketService = require('../services/ticket.service');

class TicketController {
    async getTickets(req, res) {
        try {
            const filters = {
                ...req.query,
                userId: req.user.id,
                isAdmin: req.user.role === 'ADMIN_ROLE'
            };
            const tickets = await ticketService.getTickets(filters);
            res.json(tickets);
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getTicketById(req, res) {
        try {
            const ticket = await ticketService.getTicketById(req.params.id);
            
            // Verificar se o usuário tem acesso ao ticket
            if (!req.user.role === 'ADMIN_ROLE' && ticket.user_id !== req.user.id) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            res.json(ticket);
        } catch (error) {
            console.error('Erro ao buscar ticket:', error);
            res.status(404).json({ message: error.message });
        }
    }

    async createTicket(req, res) {
        try {
            console.log('CreateTicket - Body original:', {
                body: req.body,
                priority: req.body.priority,
                category: req.body.category
            });

            // Extrair valores dos objetos do select se necessário
            const ticketData = {
                ...req.body,
                priority: req.body.priority?.value || req.body.priority,
                category: req.body.category?.value || req.body.category
            };

            console.log('CreateTicket - Dados processados:', ticketData);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('CreateTicket - Erros de validação:', errors.array());
                return res.status(400).json({ 
                    message: 'Erro de validação',
                    errors: errors.array()
                });
            }

            const ticket = await ticketService.createTicket({
                ...ticketData,
                userId: req.user.id,
                attachments: req.files
            });
            res.status(201).json(ticket);
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async addMessage(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('AddMessage - Erros de validação:', errors.array());
                return res.status(400).json({ 
                    message: 'Erro de validação',
                    errors: errors.array()
                });
            }

            const ticket = await ticketService.getTicketById(req.params.id);
            
            // Verificar se o usuário tem acesso ao ticket
            if (!req.user.role === 'ADMIN_ROLE' && ticket.user_id !== req.user.id) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const updatedTicket = await ticketService.addMessage(req.params.id, {
                ...req.body,
                userId: req.user.id,
                attachments: req.files,
                isSupport: req.user.role === 'ADMIN_ROLE'
            });
            res.json(updatedTicket);
        } catch (error) {
            console.error('Erro ao adicionar mensagem:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            console.log('UpdateStatus - Body original:', {
                body: req.body,
                status: req.body.status
            });

            // Extrair valor do objeto do select se necessário
            const statusData = {
                ...req.body,
                status: req.body.status?.value || req.body.status
            };

            console.log('UpdateStatus - Dados processados:', statusData);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('UpdateStatus - Erros de validação:', errors.array());
                return res.status(400).json({ 
                    message: 'Erro de validação',
                    errors: errors.array()
                });
            }

            // Apenas administradores podem atualizar o status
            if (req.user.role !== 'ADMIN_ROLE') {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const ticket = await ticketService.updateTicketStatus(
                req.params.id,
                statusData.status
            );
            res.json(ticket);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new TicketController(); 
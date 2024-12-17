// Mock data for tickets
const MOCK_TICKETS = [
    {
        id: 1,
        title: 'Problema com login',
        description: 'Não consigo fazer login no sistema',
        status: 'open',
        priority: 'high',
        category: 'technical',
        userId: 1,
        userName: 'João Silva',
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z',
        messages: [
            {
                id: 1,
                message: 'Não consigo fazer login no sistema desde ontem',
                userId: 1,
                userName: 'João Silva',
                isSupport: false,
                createdAt: '2024-03-20T10:00:00Z',
                attachments: []
            }
        ]
    },
    {
        id: 2,
        title: 'Dúvida sobre relatórios',
        description: 'Como exporto os relatórios em PDF?',
        status: 'in-progress',
        priority: 'medium',
        category: 'doubt',
        userId: 2,
        userName: 'Maria Santos',
        createdAt: '2024-03-19T15:30:00Z',
        updatedAt: '2024-03-20T09:00:00Z',
        messages: [
            {
                id: 1,
                message: 'Preciso exportar os relatórios em PDF',
                userId: 2,
                userName: 'Maria Santos',
                isSupport: false,
                createdAt: '2024-03-19T15:30:00Z',
                attachments: []
            },
            {
                id: 2,
                message: 'Clique no botão "Exportar" no canto superior direito do relatório',
                userId: 3,
                userName: 'Suporte Técnico',
                isSupport: true,
                createdAt: '2024-03-20T09:00:00Z',
                attachments: []
            }
        ]
    }
];

export const TICKET_CATEGORIES = [
    { value: 'technical', label: 'Problemas técnicos' },
    { value: 'doubt', label: 'Dúvidas sobre o sistema' },
    { value: 'error', label: 'Relatório de erros' },
    { value: 'suggestion', label: 'Sugestões' }
];

export const TICKET_PRIORITIES = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' }
];

export const TICKET_STATUS = [
    { value: 'open', label: 'Aberto' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'closed', label: 'Fechado' }
];

export const getTickets = async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredTickets = [...MOCK_TICKETS];

    if (filters.userId) {
        filteredTickets = filteredTickets.filter(ticket => ticket.userId === filters.userId);
    }

    if (filters.status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
    }

    if (filters.category) {
        filteredTickets = filteredTickets.filter(ticket => ticket.category === filters.category);
    }

    if (filters.priority) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
    }

    if (filters.userSearch) {
        const search = filters.userSearch.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket =>
            ticket.userName.toLowerCase().includes(search)
        );
    }

    return filteredTickets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

export const getTicketById = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const ticket = MOCK_TICKETS.find(t => t.id === parseInt(id));
    if (!ticket) throw new Error('Ticket não encontrado');
    return ticket;
};

export const createTicket = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTicket = {
        id: MOCK_TICKETS.length + 1,
        ...data,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [{
            id: 1,
            message: data.description,
            userId: data.userId,
            userName: data.userName,
            isSupport: false,
            createdAt: new Date().toISOString(),
            attachments: data.attachments ? Array.from(data.attachments).map((file, index) => ({
                id: index + 1,
                name: file.name,
                url: URL.createObjectURL(file)
            })) : []
        }]
    };

    MOCK_TICKETS.push(newTicket);
    return newTicket;
};

export const addMessage = async (ticketId, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const ticket = MOCK_TICKETS.find(t => t.id === parseInt(ticketId));
    if (!ticket) throw new Error('Ticket não encontrado');

    const newMessage = {
        id: ticket.messages.length + 1,
        message: data.message,
        userId: data.userId,
        userName: data.userName,
        isSupport: data.isSupport,
        createdAt: new Date().toISOString(),
        attachments: data.attachments ? Array.from(data.attachments).map((file, index) => ({
            id: index + 1,
            name: file.name,
            url: URL.createObjectURL(file)
        })) : []
    };

    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date().toISOString();

    return ticket;
};

export const updateTicketStatus = async (ticketId, status) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const ticket = MOCK_TICKETS.find(t => t.id === parseInt(ticketId));
    if (!ticket) throw new Error('Ticket não encontrado');

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    return ticket;
}; 
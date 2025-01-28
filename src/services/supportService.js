const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        userName: 'Instrutor',
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

const getAuthHeader = (isFormData = false) => {
    const auth = JSON.parse(localStorage.getItem('@presenca:auth'));
    if (!auth || !auth.token) {
        throw new Error('Usuário não autenticado');
    }
    return {
        'Authorization': `Bearer ${auth.token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const data = await response.json();
        
        if (data.errors && Array.isArray(data.errors)) {
            throw new Error(data.errors.map(err => err.message || err).join(', '));
        }
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (data.message) {
            throw new Error(data.message);
        }
        
        throw new Error('Ocorreu um erro na operação');
    }
    
    return response.status !== 204 ? response.json() : null;
};

export const getTickets = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status?.value || filters.status);
        if (filters.category) params.append('category', filters.category?.value || filters.category);
        if (filters.priority) params.append('priority', filters.priority?.value || filters.priority);
        if (filters.userSearch) params.append('userSearch', filters.userSearch);

        const response = await fetch(`${API_URL}/tickets?${params}`, {
            headers: getAuthHeader()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Erro ao buscar tickets:', error);
        throw error;
    }
};

export const getTicketById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/tickets/${id}`, {
            headers: getAuthHeader()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Erro ao buscar ticket:', error);
        throw error;
    }
};

export const createTicket = async (data) => {
    try {
        const auth = JSON.parse(localStorage.getItem('@presenca:auth'));
        const userType = auth?.user?.roles?.includes('INSTRUCTOR_ROLE') ? 'instructor' : 'user';

        // Se tem anexos, usa FormData
        if (data.attachments && data.attachments.length > 0) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('priority', data.priority?.value || data.priority);
            formData.append('category', data.category?.value || data.category);
            formData.append('userType', userType);

            Array.from(data.attachments).forEach(file => {
                formData.append('attachments', file);
            });

            const response = await fetch(`${API_URL}/tickets`, {
                method: 'POST',
                headers: getAuthHeader(true),
                body: formData
            });

            return await handleResponse(response);
        }

        // Se não tem anexos, envia como JSON
        const response = await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                priority: data.priority?.value || data.priority,
                category: data.category?.value || data.category,
                userType: userType
            })
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        throw error;
    }
};

export const addMessage = async (ticketId, data) => {
    try {
        const auth = JSON.parse(localStorage.getItem('@presenca:auth'));
        const userType = auth?.user?.roles?.includes('INSTRUCTOR_ROLE') ? 'instructor' : 'user';

        // Se tem anexos, usa FormData
        if (data.attachments && data.attachments.length > 0) {
            const formData = new FormData();
            formData.append('message', data.message);
            formData.append('userType', userType);

            Array.from(data.attachments).forEach(file => {
                formData.append('attachments', file);
            });

            const response = await fetch(`${API_URL}/tickets/${ticketId}/messages`, {
                method: 'POST',
                headers: getAuthHeader(true),
                body: formData
            });

            return await handleResponse(response);
        }

        // Se não tem anexos, envia como JSON
        const response = await fetch(`${API_URL}/tickets/${ticketId}/messages`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
                message: data.message,
                userType: userType
            })
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Erro ao adicionar mensagem:', error);
        throw error;
    }
};

export const updateTicketStatus = async (ticketId, status) => {
    try {
        const statusValue = status?.value || status;
        const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
            method: 'PATCH',
            headers: getAuthHeader(),
            body: JSON.stringify({ status: statusValue })
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
    }
}; 
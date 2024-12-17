import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';
import Modal from '../components/General/modal';
import {
    createTicket,
    getTickets,
    getTicketById,
    addMessage,
    updateTicketStatus
} from '../services/supportService';

import TicketForm from '../components/Support/ticketForm';
import TicketList from '../components/Support/ticketList';
import TicketDetails from '../components/Support/ticketDetails';
import TicketFilters from '../components/Support/ticketFilters';
import TicketStats from '../components/Support/ticketStats';
import { PlusIcon } from '@heroicons/react/20/solid';

export default function Support() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        priority: '',
        userSearch: ''
    });
    const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole('ADMIN_ROLE');

    const fetchTickets = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getTickets({
                ...filters,
                userId: !isAdmin ? user.id : undefined
            });
            setTickets(data);
        } catch (error) {
            showToast.error('Erro', 'Não foi possível carregar os tickets');
        } finally {
            setIsLoading(false);
        }
    }, [filters, isAdmin, user.id]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleCreateTicket = async (data) => {
        try {
            setIsLoading(true);
            await createTicket({
                ...data,
                userId: user.id,
                userName: user.name
            });
            showToast.success('Sucesso', 'Ticket criado com sucesso!');
            fetchTickets();
        } catch (error) {
            showToast.error('Erro', error.message || 'Erro ao criar ticket');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenTicket = async (ticketId) => {
        try {
            const ticket = await getTicketById(ticketId);
            setSelectedTicket(ticket);
            setIsModalOpen(true);
        } catch (error) {
            showToast.error('Erro', 'Não foi possível abrir o ticket');
        }
    };

    const handleAddMessage = async (ticketId, message) => {
        try {
            await addMessage(ticketId, {
                message,
                userId: user.id,
                userName: user.name,
                isSupport: isAdmin
            });
            const updatedTicket = await getTicketById(ticketId);
            setSelectedTicket(updatedTicket);
            fetchTickets();
        } catch (error) {
            showToast.error('Erro', 'Não foi possível enviar a mensagem');
        }
    };

    const handleUpdateStatus = async (ticketId, status) => {
        try {
            await updateTicketStatus(ticketId, status);
            const updatedTicket = await getTicketById(ticketId);
            setSelectedTicket(updatedTicket);
            fetchTickets();
            showToast.success('Sucesso', 'Status atualizado com sucesso!');
        } catch (error) {
            showToast.error('Erro', 'Não foi possível atualizar o status');
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Suporte
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Encontre soluções para seus problemas ou entre em contato com a equipe de suporte.
                    </p>
                </div>
                <button
                    onClick={() => setIsNewTicketModalOpen(true)}
                    className="btn-gradient flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Novo Ticket
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <TicketStats tickets={tickets} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <TicketFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    isAdmin={isAdmin}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {isAdmin ? 'Todos os Tickets' : 'Meus Tickets'}
                </h2>
                <TicketList
                    tickets={tickets}
                    onOpenTicket={handleOpenTicket}
                    isLoading={isLoading}
                />
            </motion.div>

            <Modal
                isOpen={isNewTicketModalOpen}
                onClose={() => setIsNewTicketModalOpen(false)}
                title="Novo Ticket"
                size="xl"
            >
                <TicketForm 
                    onSubmit={(data) => {
                        handleCreateTicket(data);
                        setIsNewTicketModalOpen(false);
                    }}
                    isLoading={isLoading}
                />
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Ticket #${selectedTicket?.id}`}
                size="xl"
            >
                {selectedTicket && (
                    <TicketDetails
                        ticket={selectedTicket}
                        onAddMessage={handleAddMessage}
                        onUpdateStatus={handleUpdateStatus}
                        isAdmin={isAdmin}
                    />
                )}
            </Modal>
        </div>
    );
} 
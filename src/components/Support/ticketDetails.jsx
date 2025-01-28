import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Select from 'react-select';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import { TICKET_STATUS } from '../../services/supportService';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';

export default function TicketDetails({ ticket, onAddMessage, onUpdateStatus, isAdmin }) {
    const [newMessage, setNewMessage] = useState('');
    const [attachments, setAttachments] = useState(null);
    const { isDark } = useTheme();
    const { user } = useAuth();
    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await onAddMessage(ticket.id, newMessage, attachments);
            setNewMessage('');
            setAttachments(null);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const handleFileChange = (e) => {
        setAttachments(e.target.files);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {ticket.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Criado por: {ticket.creator?.name || 'Usuário não encontrado'}</span>
                        <span>•</span>
                        <span>{format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'open' ? 'Aberto' : 
                         ticket.status === 'in-progress' ? 'Em Andamento' : 'Fechado'}
                    </span>
                    {isAdmin && ticket.status !== 'closed' && (
                        <Select
                            value={{ value: ticket.status, label: getStatusLabel(ticket.status) }}
                            onChange={(option) => onUpdateStatus(ticket.id, option.value)}
                            options={TICKET_STATUS}
                            styles={stylesSelect}
                            className="w-52"
                            classNamePrefix="select"
                        />
                    )}
                </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto p-4 glass-card">
                {ticket.messages.map((message, index) => {
                    const isOwnMessage = message.sender_id === user?.id || (message.is_support && isAdmin);
                    const messagePosition = isOwnMessage ? 'justify-end' : 'justify-start';
                    const messageColor = message.is_support 
                        ? 'bg-primary-100 dark:bg-primary-800/50'
                        : isOwnMessage
                            ? 'bg-slate-100 dark:bg-slate-800/50'
                            : 'bg-gray-100 dark:bg-gray-700/50';
                    const textColor = message.is_support
                        ? 'text-primary-900 dark:text-primary-100'
                        : isOwnMessage
                            ? 'text-slate-900 dark:text-slate-100'
                            : 'text-gray-900 dark:text-gray-100';

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${messagePosition}`}
                        >
                            <div className={`max-w-lg rounded-lg p-4 ${messageColor}`}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className={`text-sm font-medium ${textColor}`}>
                                        {message.is_support ? 'Administrador' : 
                                         message.sender_type === 'instructor' ? message.instructorSender?.name :
                                         message.userSender?.name || 'Usuário'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {message.created_at ? format(new Date(message.created_at), 'dd/MM/yyyy HH:mm') : ''}
                                    </span>
                                </div>
                                <p className={`text-sm ${textColor}`}>
                                    {message.message}
                                </p>
                                {Array.isArray(message.attachments) && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {message.attachments.map((attachment, i) => (
                                            <a
                                                key={i}
                                                href={attachment.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                                            >
                                                <FiPaperclip className="h-4 w-4" />
                                                {attachment.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {ticket.status !== 'closed' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="input-field w-full"
                        rows={3}
                    />
                    <div className="flex justify-between items-center">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            accept=".jpg,.jpeg,.png,.pdf"
                        />
                        <motion.button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="btn-gradient flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiSend className="h-4 w-4 text-gray-100 dark:text-gray-100" />
                            <span className="text-sm text-gray-100 dark:text-gray-100">Enviar</span>
                        </motion.button>
                    </div>
                </form>
            )}
        </div>
    );
}

function getStatusColor(status) {
    const colors = {
        'open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || colors.open;
}

function getStatusLabel(status) {
    const labels = {
        'open': 'Aberto',
        'in-progress': 'Em Andamento',
        'closed': 'Fechado'
    };
    return labels[status] || 'Aberto';
} 
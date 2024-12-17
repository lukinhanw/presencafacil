import { motion } from 'framer-motion';
import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    InboxIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function TicketStats({ tickets }) {
    const stats = {
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        highPriority: tickets.filter(t => t.priority === 'high' && t.status !== 'closed').length,
        totalMessages: tickets.reduce((acc, ticket) => acc + ticket.messages?.length || 0, 0)
    };

    const statItems = [
        {
            name: 'Tickets Abertos',
            value: stats.open,
            icon: ExclamationCircleIcon,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10'
        },
        {
            name: 'Em Andamento',
            value: stats.inProgress,
            icon: ClockIcon,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10'
        },
        {
            name: 'Finalizados',
            value: stats.closed,
            icon: CheckCircleIcon,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10'
        },
        {
            name: 'Alta Prioridade',
            value: stats.highPriority,
            icon: ExclamationCircleIcon,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10'
        },
        {
            name: 'Total de Mensagens',
            value: stats.totalMessages,
            icon: ChatBubbleLeftRightIcon,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10'
        }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
            {statItems.map((stat, index) => (
                <motion.div
                    key={stat.name}
                    variants={item}
                    className="glass-card p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="flex items-center">
                        <div className={`flex-shrink-0 p-2 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {stat.name}
                            </p>
                            <p className={`text-lg font-semibold ${stat.color}`}>
                                {stat.value}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
} 
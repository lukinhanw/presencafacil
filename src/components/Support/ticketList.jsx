import { format } from 'date-fns';
import { motion } from 'framer-motion';

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

export default function TicketList({ tickets, onOpenTicket, isLoading }) {
  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600 dark:text-red-400',
      'medium': 'text-yellow-600 dark:text-yellow-400',
      'low': 'text-blue-600 dark:text-blue-400'
    };
    return colors[priority] || colors.low;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="glass-card p-4">
              <div className="h-4 bg-gray-300/30 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-300/30 rounded"></div>
                <div className="h-3 bg-gray-300/30 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum ticket encontrado
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {tickets.map((ticket) => (
        <motion.div
          key={ticket.id}
          variants={item}
          whileHover={{ scale: 1.01 }}
          onClick={() => onOpenTicket(ticket.id)}
          className="glass-card p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  #{ticket.id} - {ticket.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status === 'open' ? 'Aberto' : 
                   ticket.status === 'in-progress' ? 'Em Andamento' : 'Fechado'}
                </span>
                <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority === 'high' ? 'Alta' :
                   ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {ticket.description}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
            <span>Por: {ticket.userName}</span>
            <span>•</span>
            <span>Criado em: {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            <span>•</span>
            <span>Última atualização: {format(new Date(ticket.updatedAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 
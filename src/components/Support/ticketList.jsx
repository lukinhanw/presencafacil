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

const formatDate = (dateString) => {
	try {
		if (!dateString) return 'Data não disponível';
		
		// Converte a string da data para o formato que o JavaScript entende
		const formattedDate = dateString.replace(' ', 'T');
		const date = new Date(formattedDate);
		
		if (isNaN(date.getTime())) return 'Data inválida';
		return format(date, 'dd/MM/yyyy HH:mm');
	} catch (error) {
		console.error('Erro ao formatar data:', error);
		return 'Data inválida';
	}
};

export default function TicketList({ tickets, onOpenTicket, isLoading }) {
	const getStatusColor = (status) => {
		const colors = {
			'open': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
			'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
			'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
		};
		return colors[status] || colors.open;
	};

	const getPriorityColor = (priority) => {
		const colors = {
			'high': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
			'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
			'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
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

	console.log(tickets);

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
					className="glass-card p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
				>
					<div className="flex justify-between items-start">
						<div className="flex-1">
							<div className="flex items-center gap-2 flex-wrap">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									#{ticket.id} - {ticket.title}
								</h3>
								<span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
									{ticket.status === 'open' ? 'Aberto' :
										ticket.status === 'in-progress' ? 'Em Andamento' : 'Fechado'}
								</span>
								<span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
									{ticket.priority === 'high' ? 'Alta' :
										ticket.priority === 'medium' ? 'Média' : 'Baixa'}
								</span>
							</div>
							<p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
								{ticket.description}
							</p>
						</div>
						<button 
							className="ml-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
							onClick={() => onOpenTicket(ticket.id)}
						>
							Ver Detalhes
						</button>
					</div>

					<div className="mt-4 flex items-center text-xs text-gray-600 dark:text-gray-300 space-x-4 flex-wrap">
						<span>Por: {ticket.creator?.name || 'Usuário não encontrado'}</span>
						<span>•</span>
						<span>Criado em: {formatDate(ticket.createdAt)}</span>
						<span>•</span>
						<span>Última atualização: {formatDate(ticket.updatedAt)}</span>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
} 
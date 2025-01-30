import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	AcademicCapIcon,
	UserGroupIcon,
	BookOpenIcon,
	UserIcon,
	QuestionMarkCircleIcon,
	ChartBarIcon,
	ArrowDownIcon,
} from '@heroicons/react/24/outline';
import DashboardStats from '../components/Dashboard/DashboardStats';

const menuItems = [
	{
		name: 'Aulas',
		path: '/aulas',
		icon: AcademicCapIcon,
		description: 'Gerencie as aulas e presenças',
		bgColor: 'from-blue-500/10 to-blue-600/10',
		iconColor: 'text-blue-600 dark:text-blue-400',
	},
	{
		name: 'Treinamentos',
		path: '/treinamentos',
		icon: BookOpenIcon,
		description: 'Controle os treinamentos',
		bgColor: 'from-purple-500/10 to-purple-600/10',
		iconColor: 'text-purple-600 dark:text-purple-400',
	},
	{
		name: 'Colaboradores',
		path: '/colaboradores',
		icon: UserGroupIcon,
		description: 'Gestão de colaboradores',
		bgColor: 'from-green-500/10 to-green-600/10',
		iconColor: 'text-green-600 dark:text-green-400',
	},
	{
		name: 'Instrutores',
		path: '/instrutores',
		icon: UserIcon,
		description: 'Gerencie os instrutores',
		bgColor: 'from-orange-500/10 to-orange-600/10',
		iconColor: 'text-orange-600 dark:text-orange-400',
	},
	{
		name: 'Administradores',
		path: '/administradores',
		icon: UserIcon,
		description: 'Gerencie os administradores',
		bgColor: 'from-indigo-500/10 to-indigo-600/10',
		iconColor: 'text-indigo-600 dark:text-indigo-400',
	},
	{
		name: 'Suporte',
		path: '/suporte',
		icon: QuestionMarkCircleIcon,
		description: 'Central de ajuda e suporte',
		bgColor: 'from-red-500/10 to-red-600/10',
		iconColor: 'text-red-600 dark:text-red-400',
	},
	{
		name: 'Relatórios',
		path: '/relatorios',
		icon: ChartBarIcon,
		description: 'Visualize estatísticas',
		bgColor: 'from-teal-500/10 to-teal-600/10',
		iconColor: 'text-teal-600 dark:text-teal-400',
	},
];

// Variantes de animação para o container
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.3,
		},
	},
};

// Variantes de animação para os itens
const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 12,
		},
	},
};

// Variantes para o título
const titleVariants = {
	hidden: { y: -20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 12,
		},
	},
};

export default function Dashboard() {
	const navigate = useNavigate();

	return (
		<div className="container mx-auto px-4 h-full flex flex-col">
			<motion.div
				className="text-center mb-8 mt-10"
				initial="hidden"
				animate="visible"
				variants={titleVariants}
			>
				<h1 className="text-4xl font-bold mb-3">
					<span className="gradient-text">Lista de Presença</span>
					<span className="text-gray-700 dark:text-gray-300"> Digital</span>
				</h1>
				<p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
					Transformando a gestão de presenças e desenvolvimento profissional
				</p>
			</motion.div>

			<motion.div
				className="mb-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 px-4">
					Visão Geral do Dia
				</h2>
				<DashboardStats />
			</motion.div>

			<div className="relative mb-8">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
				</div>
				<motion.div
					className="relative flex justify-center"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{
						type: "spring",
						stiffness: 260,
						damping: 20,
						delay: 0.5
					}}
				>
					<div className="bg-[var(--background-start)] px-4">
						<ArrowDownIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 animate-bounce" />
					</div>
				</motion.div>
			</div>

			<div className="flex-1 rounded-lg">
				<motion.h2
					className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 px-4"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.6 }}
				>
					Menu Principal
				</motion.h2>
				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{menuItems.map((item, index) => (
						<motion.button
							key={item.path}
							variants={itemVariants}
							whileHover={{
								scale: 1.02,
								transition: { type: "spring", stiffness: 400, damping: 10 }
							}}
							whileTap={{ scale: 0.98 }}
							onClick={() => navigate(item.path)}
							className="group relative overflow-hidden glass-card-alt"
						>
							{/* Gradient Background com animação */}
							<div className={`absolute inset-0 opacity-30 bg-gradient-to-br  group-hover:opacity-40 transition-opacity duration-300`} />

							{/* Content */}
							<div className="relative z-10 p-6">
								<div className="flex items-start space-x-4">
									<div className={`p-3 rounded-lg bg-white/90 dark:bg-gray-800/90  transform group-hover:scale-110 transition-transform duration-300`}>
										<item.icon className={`h-8 w-8 ${item.iconColor}`} />
									</div>
									<div className="flex-1 text-left">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors duration-300">
											{item.name}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{item.description}
										</p>
									</div>
								</div>

								{/* Hover Effect Line com gradiente animado */}
								<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
							</div>

							{/* Indicador de ação */}
							<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div className={`${item.iconColor} bg-white/90 dark:bg-gray-800/90 p-1 rounded-full`}>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</motion.button>
					))}
				</motion.div>
			</div>
		</div>
	);
}
import { useState, useEffect } from 'react';
import { UsersIcon, ClockIcon, AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { showToast } from '../General/toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultStats = [
	{
		id: 'classes',
		name: 'Aulas Hoje',
		value: '0',
		icon: AcademicCapIcon,
		change: '0',
		color: 'text-blue-600 dark:text-blue-400',
		bgColor: 'bg-blue-500/10',
	},
	{
		id: 'attendees',
		name: 'Presentes',
		value: '0',
		icon: UsersIcon,
		change: '0',
		color: 'text-green-600 dark:text-green-400',
		bgColor: 'bg-green-500/10',
	},
	{
		id: 'trainingHours',
		name: 'Horas Treinamento',
		value: '0h',
		icon: ClockIcon,
		change: '0h',
		color: 'text-purple-600 dark:text-purple-400',
		bgColor: 'bg-purple-500/10',
	},
	{
		id: 'completionRate',
		name: 'Conclusões',
		value: '0%',
		icon: CheckBadgeIcon,
		change: '0%',
		color: 'text-teal-600 dark:text-teal-400',
		bgColor: 'bg-teal-500/10',
	},
];

export default function DashboardStats() {
	const [stats, setStats] = useState(defaultStats);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch(`${API_URL}/dashboard/stats`, {
					headers: {
						'Authorization': `Bearer ${JSON.parse(localStorage.getItem('@presenca:auth')).token}`
					}
				});

				if (!response.ok) {
					throw new Error('Erro ao carregar estatísticas');
				}

				const data = await response.json();
				
				if (data.success) {
					setStats(stats.map(stat => ({
						...stat,
						value: data.data[stat.id].value,
						change: data.data[stat.id].change
					})));
				}
			} catch (error) {
				showToast.error('Erro', error.message || 'Erro ao carregar estatísticas');
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{stats.map((stat) => (
					<div key={stat.id} className="glass-card-alt p-4 animate-pulse">
						<div className="flex items-center">
							<div className={`${stat.bgColor} p-3 rounded-lg`}>
								<stat.icon className={`h-6 w-6 ${stat.color}`} />
							</div>
							<div className="ml-4 flex-1">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-1"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			{stats.map((stat) => (
				<div key={stat.id} className="glass-card-alt p-4">
					<div className="flex items-center">
						<div className={`${stat.bgColor} p-3 rounded-lg`}>
							<stat.icon className={`h-6 w-6 ${stat.color}`} />
						</div>
						<div className="ml-4 flex-1">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
							<div className="flex items-baseline">
								<p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
								<span className={`ml-2 text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
									{stat.change}
								</span>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
} 
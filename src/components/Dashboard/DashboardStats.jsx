import { UsersIcon, ClockIcon, AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const stats = [
	{
		name: 'Aulas Hoje',
		value: '12',
		icon: AcademicCapIcon,
		change: '+2',
		changeType: 'increase',
		color: 'text-blue-600 dark:text-blue-400',
		bgColor: 'bg-blue-500/10',
	},
	{
		name: 'Presentes',
		value: '148',
		icon: UsersIcon,
		change: '+24',
		changeType: 'increase',
		color: 'text-green-600 dark:text-green-400',
		bgColor: 'bg-green-500/10',
	},
	{
		name: 'Horas Treinamento',
		value: '86h',
		icon: ClockIcon,
		change: '+12h',
		changeType: 'increase',
		color: 'text-purple-600 dark:text-purple-400',
		bgColor: 'bg-purple-500/10',
	},
	{
		name: 'Conclusões',
		value: '94%',
		icon: CheckBadgeIcon,
		change: '+2%',
		changeType: 'increase',
		color: 'text-teal-600 dark:text-teal-400',
		bgColor: 'bg-teal-500/10',
	},
];

export default function DashboardStats() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			{stats.map((stat) => (
				<div key={stat.name} className="glass-card-alt p-4">
					<div className="flex items-center">
						<div className={`${stat.bgColor} p-3 rounded-lg`}>
							<stat.icon className={`h-6 w-6 ${stat.color}`} />
						</div>
						<div className="ml-4 flex-1">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
							<div className="flex items-baseline">
								<p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
								<span className={`ml-2 text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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
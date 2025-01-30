import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
	AcademicCapIcon,
	UserGroupIcon,
	BookOpenIcon,
	UserIcon,
	Bars3Icon,
	XMarkIcon,
	HomeIcon,
	QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';

const navigation = [
	{
		name: 'Dashboard',
		path: '/',
		icon: HomeIcon
	},
	{
		name: 'Aulas',
		path: '/aulas',
		icon: AcademicCapIcon
	},
	{
		name: 'Treinamentos',
		path: '/treinamentos',
		icon: BookOpenIcon,
		roles: ['ADMIN_ROLE', 'INSTRUCTOR_ROLE']
	},
	{
		name: 'Colaboradores',
		path: '/colaboradores',
		icon: UserGroupIcon,
		roles: ['ADMIN_ROLE']
	},
	{
		name: 'Instrutores',
		path: '/instrutores',
		icon: UserIcon,
		roles: ['ADMIN_ROLE']
	},
	{
		name: 'Administradores',
		path: '/administradores',
		icon: UserIcon,
		roles: ['ADMIN_ROLE']
	},
	{
		name: 'Suporte',
		path: '/suporte',
		icon: QuestionMarkCircleIcon
	}
];

export default function Sidebar() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { user, logout } = useAuth();

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<>
			<button
				className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg 
                   bg-white/95 hover:bg-primary-50/50 dark:bg-white/10 dark:hover:bg-white/20
                   transition-all duration-300 border border-gray-200 dark:border-white/20"
				onClick={toggleSidebar}
			>
				{isSidebarOpen ? (
					<XMarkIcon className="h-6 w-6 text-primary-600" />
				) : (
					<Bars3Icon className="h-6 w-6 text-primary-600" />
				)}
			</button>

			<div className={`
        fixed top-0 left-0 h-full w-64 sidebar
        transform transition-transform duration-300 ease-in-out z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
				<div className="flex flex-col h-full">
					<div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
						<h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
							Lista de Presença
						</h2>
						<ThemeToggle />
					</div>

					<nav className="flex-1 px-4 py-4 space-y-2">
						{navigation.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								className={({ isActive }) => `
                  nav-link ${isActive ? 'nav-link-active' : ''}
                `}
							>
								<item.icon className="h-5 w-5 mr-3" />
								{item.name}
							</NavLink>
						))}
					</nav>

					<div className="p-4 border-t border-gray-200 dark:border-white/10">
						<div className="flex items-center mb-4 p-3
                          bg-gradient-to-r from-gray-50 to-white
                          dark:from-white/5 dark:to-white/10
                          hover:from-primary-50 hover:to-secondary-50
                          dark:hover:from-white/10 dark:hover:to-white/20
                          transition-all duration-300 rounded-lg 
                          border border-gray-200 dark:border-white/20">
							<div>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">{user?.roles?.[0]}</p>
							</div>
						</div>
						<button onClick={logout} className="btn-gradient w-full">
							Sair
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
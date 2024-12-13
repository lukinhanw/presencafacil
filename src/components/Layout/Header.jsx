import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '../General/themeToggle';
import UserMenu from './UserMenu';
import Breadcrumb from './Breadcrumb';

export default function Header() {
	const navigate = useNavigate();

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-30 glass-card-alt bg-opacity-50 h-[50px] flex items-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="flex justify-between items-center">
						<button
							onClick={() => navigate(-1)}
							className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
						>
							<ArrowLeftIcon className="h-5 w-5" />
							<span>Voltar</span>
						</button>

						<div className="flex items-center space-x-4">
							<ThemeToggle />
							<UserMenu />
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
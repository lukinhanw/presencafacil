import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import UserDropdown from './UserDropdown';
import LogoutConfirmation from './LogoutConfirmation';
import Breadcrumb from './Breadcrumb';

export default function Header() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	const handleLogout = () => {
		setShowLogoutModal(true);
	};

	const handleProfileClick = () => {
		navigate('/perfil');
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-30">
				{/* Barra superior com gradiente */}
				<div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
				
				<div className="bg-gray-800 dark:bg-gray-900 shadow-sm border-b border-gray-700 dark:border-gray-800">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center space-x-4">
								<button
									onClick={() => navigate(-1)}
									className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors duration-300"
								>
									<ArrowLeftIcon className="h-5 w-5" />
									<span>Voltar</span>
								</button>
								<div className="hidden md:block h-6 w-px bg-gray-700" />
								<Breadcrumb />
							</div>

							{/* Perfil e Menu */}
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-3">
									<div className="hidden sm:flex flex-col items-end">
										<span className="text-sm font-medium text-gray-200">
											{user?.name}
										</span>
										<span className="text-xs text-gray-400">
											{user?.role}
										</span>
									</div>
									<UserDropdown 
										user={user}
										onLogout={handleLogout}
										onProfileClick={handleProfileClick}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<LogoutConfirmation
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
			/>
		</>
	);
}
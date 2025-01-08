import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserDropdown from './UserDropdown';
import LogoutConfirmation from './LogoutConfirmation';
import Logo from './Logo';
import PageIndicator from './PageIndicator';

export default function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const isDashboard = location.pathname === '/';

	const handleLogout = () => {
		setShowLogoutModal(true);
	};

	const handleProfileClick = () => {
		navigate('/perfil');
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-30">
				{/* Barra superior com gradiente animado */}
				<div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 animate-gradient-x" />
				
				<div className="bg-gray-800 dark:bg-gray-900 shadow-lg border-b border-gray-700 dark:border-gray-800">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center space-x-4">
								<Logo />
								<div className="hidden md:block h-6 w-px bg-gray-700" />
								{isDashboard ? (
									<div className="hidden md:flex items-center space-x-2">
										<span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium">
											Dashboard
										</span>
									</div>
								) : (
									<PageIndicator />
								)}
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
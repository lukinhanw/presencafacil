import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserDropdown from '../Layout/UserDropdown';
import LogoutConfirmation from '../Layout/LogoutConfirmation';
import Logo from '../Layout/Logo';

// URLs das imagens do Unsplash
const LOGO_URL = "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

export default function DashboardHeader() {
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		setShowLogoutModal(true);
	};

	const handleProfileClick = () => {
		navigate('/perfil');
	};

	return (
		<>
			<header className="fixed w-full top-0 z-50">
				{/* Barra superior com gradiente animado */}
				<div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 animate-gradient-x" />

				{/* Container principal do header */}
				<div className="bg-gray-800 dark:bg-gray-900 shadow-lg border-b border-gray-700 dark:border-gray-800">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							{/* Logo e Nome */}
							<div className="flex items-center space-x-4">
								<Logo />
								<div className="hidden md:block h-6 w-px bg-gray-700" />
								<div className="hidden md:flex items-center space-x-2">
									<span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium">
										Dashboard
									</span>
								</div>
							</div>

							{/* Perfil e Menu */}
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-3">
									<div className="flex flex-col items-end">
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
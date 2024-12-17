import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import LogoutConfirmation from './LogoutConfirmation';

export default function UserMenu() {
	const { user, logout } = useAuth();
	const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

	const handleLogout = () => {
		setShowLogoutConfirmation(true);
	};

	const confirmLogout = () => {
		logout();
		setShowLogoutConfirmation(false);
	};

	return (
		<>
			<Menu as="div" className="relative">
				<Menu.Button className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200">
					<UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{user?.name}
					</span>
				</Menu.Button>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 mt-2 w-48 glass-card-alt divide-y divide-gray-200 dark:divide-white/10 rounded-md shadow-lg">
						<div className="px-1 py-1">
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${active ? 'bg-primary-50/50 dark:bg-white/5' : ''
											} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-white`}
									>
										<UserCircleIcon className="mr-2 h-5 w-5" />
										Meu Perfil
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${active ? 'bg-primary-50/50 dark:bg-white/5' : ''
											} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-white`}
									>
										<Cog6ToothIcon className="mr-2 h-5 w-5" />
										Configurações
									</button>
								)}
							</Menu.Item>
						</div>
						<div className="px-1 py-1">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={handleLogout}
										className={`${active ? 'bg-red-50 dark:bg-red-500/10' : ''
											} group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600 dark:text-red-400`}
									>
										<ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
										Sair
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>

			<LogoutConfirmation
				isOpen={showLogoutConfirmation}
				onClose={() => setShowLogoutConfirmation(false)}
				onConfirm={confirmLogout}
			/>
		</>
	);
}
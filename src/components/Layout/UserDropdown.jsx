import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';


const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
const API_URL = import.meta.env.VITE_API_URL;


export default function UserDropdown({ user, onLogout, onProfileClick }) {
	const { theme, toggleTheme } = useTheme();

	console.log('user avatar', user);
	

	return (
		<Menu as="div" className="relative">
			<Menu.Button className="flex-shrink-0 rounded-full p-1 hover:bg-gray-700/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
				<img
					className="h-8 w-8 rounded-full ring-2 ring-primary-500/30 object-cover"
					src={`${user?.avatar}` || DEFAULT_AVATAR}
					alt={user?.name}
				/>
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
				<Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-gray-800 dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-700 dark:divide-gray-800">
					<div className="px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={onProfileClick}
									className={`${active ? 'bg-gray-700/50 dark:bg-gray-800/50' : ''
										} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200`}
								>
									<UserCircleIcon className="mr-2 h-5 w-5" />
									Meu Perfil
								</button>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={toggleTheme}
									className={`${active ? 'bg-gray-700/50 dark:bg-gray-800/50' : ''
										} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200`}
								>
									{theme === 'dark' ? (
										<SunIcon className="mr-2 h-5 w-5" />
									) : (
										<MoonIcon className="mr-2 h-5 w-5" />
									)}
									{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
								</button>
							)}
						</Menu.Item>
					</div>
					<div className="px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={onLogout}
									className={`${active ? 'bg-gray-700/50 dark:bg-gray-800/50' : ''
										} group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-400`}
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
	);
} 
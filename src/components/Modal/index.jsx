import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	size = 'md'
}) {
	const sizeClasses = {
		sm: 'sm:max-w-md',
		md: 'sm:max-w-lg',
		lg: 'sm:max-w-xl',
		xl: 'sm:max-w-2xl'
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden glass-card-alt p-6 text-left align-middle shadow-xl transition-all`}>
								<Dialog.Title
									as="div"
									className="flex justify-between items-center mb-4"
								>
									<h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
										{title}
									</h3>
									<button
										onClick={onClose}
										className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
									>
										<XMarkIcon className="h-6 w-6" />
									</button>
								</Dialog.Title>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
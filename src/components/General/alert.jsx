import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Alert({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	type = 'danger'
}) {
	const cancelButtonRef = useRef(null);

	const getColorClasses = () => {
		switch (type) {
			case 'danger':
				return {
					icon: 'text-red-600 dark:text-red-400',
					button: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
				};
			case 'warning':
				return {
					icon: 'text-yellow-600 dark:text-yellow-400',
					button: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600'
				};
			default:
				return {
					icon: 'text-primary-600 dark:text-primary-400',
					button: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
				};
		}
	};

	const colorClasses = getColorClasses();

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-50"
				initialFocus={cancelButtonRef}
				onClose={onClose}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative bg-slate-100 dark:bg-slate-800 transform overflow-hidden glass-card px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
								<div className="sm:flex sm:items-start">
									<div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10 sm:mx-0 sm:h-10 sm:w-10`}>
										<ExclamationTriangleIcon className={`h-6 w-6 ${colorClasses.icon}`} aria-hidden="true" />
									</div>
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
											{title}
										</Dialog.Title>
										<div className="mt-2">
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{message}
											</p>
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
									<button
										type="button"
										className={`inline-flex w-full justify-center rounded-md 
													px-3 py-2 
													text-sm font-semibold 
													text-white 
													shadow-sm 
													transition-all duration-200 ease-in-out
													hover:shadow-md
													hover:scale-[1.02] active:scale-[0.98]
													hover:-translate-y-0.5
													sm:ml-3 sm:w-auto 
													${colorClasses.button}`}
										onClick={onConfirm}
									>
										{confirmText}
									</button>
									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md 
													bg-gray-100 dark:bg-gray-800 
													px-3 py-2 
													text-sm font-semibold 
													text-gray-900 dark:text-gray-100 
													shadow-sm 
													ring-1 ring-inset ring-gray-300 dark:ring-gray-600
													transition-all duration-200 ease-in-out
													hover:bg-gray-200 dark:hover:bg-gray-700
													hover:shadow-md
													hover:scale-[1.02] active:scale-[0.98]
													hover:-translate-y-0.5
													sm:mt-0 sm:w-auto"
										onClick={onClose}
										ref={cancelButtonRef}
									>
										{cancelText}
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
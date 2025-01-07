import { toast } from 'react-hot-toast';
import {
	CheckCircleIcon,
	ExclamationCircleIcon,
	InformationCircleIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline';

const icons = {
	success: CheckCircleIcon,
	error: XCircleIcon,
	warning: ExclamationCircleIcon,
	info: InformationCircleIcon,
};

const colors = {
	success: 'text-green-500 dark:text-green-400',
	error: 'text-red-500 dark:text-red-400',
	warning: 'text-yellow-500 dark:text-yellow-400',
	info: 'text-blue-500 dark:text-blue-400',
};

const backgrounds = {
	success: 'bg-slate-50 dark:bg-slate-500/80 backdrop-blur-sm',
	error: 'bg-red-50 dark:bg-red-500/80 backdrop-blur-sm',
	warning: 'bg-yellow-50 dark:bg-yellow-500/80 backdrop-blur-sm',
	info: 'bg-blue-50 dark:bg-blue-500/80 backdrop-blur-sm',
};

const CustomToast = ({ type, title, message, t }) => {
	const Icon = icons[type];

	return (
		<div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
						max-w-md w-full ${backgrounds[type]} 
						shadow-lg rounded-lg pointer-events-auto 
						flex ring-1 ring-black ring-opacity-5`}
		>
			<div className="flex-1 w-0 p-4">
				<div className="flex items-start">
					<div className="flex-shrink-0">
						<Icon className={`h-6 w-6 ${colors[type]}`} />
					</div>
					<div className="ml-3 flex-1">
						<p className="text-sm font-medium text-gray-900 dark:text-white">
							{title}
						</p>
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
							{message}
						</p>
					</div>
				</div>
			</div>
			<div className="flex border-l border-gray-200 dark:border-gray-700">
				<button
					onClick={() => toast.dismiss(t.id)}
					className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none"
				>
					Fechar
				</button>
			</div>
		</div>
	);
};

export const showToast = {
	success: (title, message) => {
		toast.custom((t) => (
			<CustomToast t={t} type="success" title={title} message={message} />
		));
	},
	error: (title, message) => {
		toast.custom((t) => (
			<CustomToast t={t} type="error" title={title} message={message} />
		));
	},
	warning: (title, message) => {
		toast.custom((t) => (
			<CustomToast t={t} type="warning" title={title} message={message} />
		));
	},
	info: (title, message) => {
		toast.custom((t) => (
			<CustomToast t={t} type="info" title={title} message={message} />
		));
	},
};
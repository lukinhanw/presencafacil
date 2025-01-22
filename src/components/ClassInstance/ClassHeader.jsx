import { formatDateTime, formatDateTimeHourMin } from '../../utils/dateUtils';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ClassHeader({
	classData,
	onOpenDetails,
	onFinishClass,
	isFinished
}) {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
					{classData.training.name}
				</h1>
				<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
					<span className="font-medium">Instrutor: {classData.instructor.name}</span>
					<span>•</span>
					<span>Início: {formatDateTimeHourMin(classData.date_start)}</span>
					<span>•</span>
					<span>Unidade: {classData.unit}</span>
					{isFinished && (
						<>
							<span>•</span>
							<span>Término: {formatDateTimeHourMin(classData.date_end)}</span>
						</>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={onOpenDetails}
					className="btn-gradient text-sm px-3 py-1.5 flex items-center gap-2"
				>
					<InformationCircleIcon className="h-5 w-5" />
					<span>Detalhes</span>
				</button>
				{!isFinished && (
					<button
						onClick={onFinishClass}
						className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
					>
						<span className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-gray-100 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
							Finalizar Aula
						</span>
					</button>
				)}
			</div>
		</div>
	);
}
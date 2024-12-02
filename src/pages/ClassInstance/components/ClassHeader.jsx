import { formatDateTime } from '../../../utils/dateUtils';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ClassHeader({
	classData,
	onOpenDetails,
	onFinishClass,
	isFinished
}) {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					{classData.training.name}
				</h1>
				<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
					<span className="font-medium">Instrutor: {classData.instructor.name}</span>
					<span>•</span>
					<span>Início: {formatDateTime(classData.date_start)}</span>
					{isFinished && (
						<>
							<span>•</span>
							<span>Término: {formatDateTime(classData.date_end)}</span>
						</>
					)}
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<button
					onClick={onOpenDetails}
					className="btn-gradient-outline px-3 py-1.5 text-sm"
					title="Detalhes"
				>
					<InformationCircleIcon className="h-5 w-5" />
					<span className="hidden md:inline ml-1">Detalhes</span>
				</button>
				{!isFinished && (
					<button
						onClick={onFinishClass}
						className="btn-gradient px-3 py-1.5 text-sm"
					>
						Finalizar Aula
					</button>
				)}
			</div>
		</div>
	);
}
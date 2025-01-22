import { useMemo } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AttendanceStats({ attendees }) {
	const present = useMemo(() => 
		attendees.filter(a => !a.early_leave).length
	, [attendees]);

	return (
		<div className="glass-card p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-200">
			<div>
				<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
					Presentes
				</h4>
				<p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
					{present}
				</p>
			</div>
			<CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
		</div>
	);
}
import { useMemo } from 'react';

export default function AttendanceStats({ attendees }) {
	const stats = useMemo(() => {
		const total = attendees.length;
		const earlyLeaves = attendees.filter(a => a.early_leave).length;

		return {
			total,
			earlyLeaves,
			present: total - earlyLeaves
		};
	}, [attendees]);

	return (
		<div className="grid grid-cols-3 gap-8 py-6">
			<div className="glass-card p-8 text-center shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-200">
				<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
					Total
				</h4>
				<p className="text-4xl font-bold text-gray-900 dark:text-white">
					{stats.total}
				</p>
			</div>

			<div className="glass-card p-8 text-center shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-200">
				<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
					Presentes
				</h4>
				<p className="text-4xl font-bold text-green-600 dark:text-green-400">
					{stats.present}
				</p>
			</div>

			<div className="glass-card p-8 text-center shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-200">
				<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
					Saídas Antecipadas
				</h4>
				<p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
					{stats.earlyLeaves}
				</p>
			</div>
		</div>
	);
}
import { useState } from 'react';
import { TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { removeAttendee, updateEarlyLeave } from '../../services/classService';
import Alert from '../General/alert';
import { showToast } from '../General/toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AttendanceList({ classId, attendees, onUpdate, isFinished }) {
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, attendeeId: null });
	const [earlyLeaveAlert, setEarlyLeaveAlert] = useState({ isOpen: false, attendeeId: null });

	const handleRemove = async () => {
		try {
			await removeAttendee(classId, deleteAlert.attendeeId);
			showToast.success('Sucesso', 'Presença removida com sucesso!');
			onUpdate();
		} catch (error) {
			showToast.error('Erro', 'Não foi possível remover a presença');
		}
		setDeleteAlert({ isOpen: false, attendeeId: null });
	};

	const handleEarlyLeave = async () => {
		try {
			await updateEarlyLeave(classId, earlyLeaveAlert.attendeeId);
			showToast.success('Sucesso', 'Saída antecipada registrada com sucesso!');
			onUpdate();
		} catch (error) {
			showToast.error('Erro', 'Não foi possível registrar a saída antecipada');
		}
		setEarlyLeaveAlert({ isOpen: false, attendeeId: null });
	};

	return (
		<div className="glass-card overflow-hidden shadow-lg rounded-xl">
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
					Lista de Presença
				</h2>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
					<thead>
						<tr className="bg-gray-100 dark:bg-gray-700">
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
								Foto
							</th>
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
								Matrícula
							</th>
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/3">
								Colaborador
							</th>
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
								Horário
							</th>
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
								Cargo
							</th>
							{!isFinished && (
								<th className="px-6 py-4 text-end text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
									Ações
								</th>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
						{attendees.map((attendee) => (
							<tr key={attendee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
								<td className="px-6 py-4 whitespace-nowrap text-sm text-center">
									{attendee.photo ? (
										<img
											src={`${API_URL}/uploads/${attendee.photo}`}
											alt={`Foto de ${attendee.name}`}
											className="w-12 h-12 rounded-full object-cover mx-auto"
										/>
									) : (
										<div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto flex items-center justify-center">
											<span className="text-gray-500 dark:text-gray-400 text-xl">
												{attendee.name.charAt(0)}
											</span>
										</div>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-100">
									{attendee.registration}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-100">
									{attendee.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-100">
									{new Date(attendee.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-100">
									{attendee.position}
								</td>
								{!isFinished && (
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex justify-end gap-2">
											{!attendee.early_leave && (
												<button
													onClick={() => setEarlyLeaveAlert({ isOpen: true, attendeeId: attendee.id })}
													className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-300 dark:hover:text-yellow-200"
													title="Registrar saída antecipada"
												>
													<ClockIcon className="h-5 w-5" />
												</button>
											)}
											<button
												onClick={() => setDeleteAlert({ isOpen: true, attendeeId: attendee.id })}
												className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
												title="Remover presença"
											>
												<TrashIcon className="h-5 w-5" />
											</button>
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Alert
				isOpen={deleteAlert.isOpen}
				onClose={() => setDeleteAlert({ isOpen: false, attendeeId: null })}
				onConfirm={handleRemove}
				title="Remover Presença"
				message="Tem certeza que deseja remover esta presença? Esta ação não pode ser desfeita."
				type="danger"
			/>

			<Alert
				isOpen={earlyLeaveAlert.isOpen}
				onClose={() => setEarlyLeaveAlert({ isOpen: false, attendeeId: null })}
				onConfirm={handleEarlyLeave}
				title="Registrar Saída Antecipada"
				message="Tem certeza que deseja registrar a saída antecipada deste colaborador?"
				type="warning"
			/>
		</div>
	);
}
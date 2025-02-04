import { useState } from 'react';
import { TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { removeAttendee, updateEarlyLeave } from '../../services/classService';
import Alert from '../General/alert';
import Modal from '../General/modal';
import { showToast } from '../General/toast';
import Tooltip from '../General/Tooltip';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AttendanceList({ classId, attendees, onUpdate, isFinished }) {
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, attendeeId: null });
	const [earlyLeaveAlert, setEarlyLeaveAlert] = useState({ isOpen: false, attendeeId: null });
	const [detailsModal, setDetailsModal] = useState({ isOpen: false, attendee: null });
	const [searchTerm, setSearchTerm] = useState('');

	const handleRemove = async () => {
		try {
			await removeAttendee(classId, deleteAlert.attendeeId);
			showToast.success('Sucesso', 'Presença removida com sucesso!');
			onUpdate();
		} catch (error) {
			showToast.error('Erro', error.message);
		}
		setDeleteAlert({ isOpen: false, attendeeId: null });
	};

	const handleEarlyLeave = async () => {
		try {
			await updateEarlyLeave(classId, earlyLeaveAlert.attendeeId);
			showToast.success('Sucesso', 'Saída antecipada registrada com sucesso!');
			onUpdate();
		} catch (error) {
			showToast.error('Erro', error.message);
		}
		setEarlyLeaveAlert({ isOpen: false, attendeeId: null });
	};

	const filteredAttendees = attendees.filter(attendee => 
		attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		attendee.registration.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="glass-card overflow-hidden shadow-lg rounded-xl">
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
					Lista de Presença
				</h2>
				<div className="relative">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Buscar por nome ou matrícula..."
						className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
					/>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
					<thead>
						<tr className="bg-gray-200 dark:bg-gray-700">
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
								Foto
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
								Colaborador
							</th>
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
								Entrada
							</th>
							<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
								Saída
							</th>
							{!isFinished && (
								<th className="px-6 py-4 text-center text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider w-1/6">
									Ações
								</th>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
						{filteredAttendees.map((attendee) => (
							<tr 
								key={attendee.id} 
								className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
							>
								<td 
									className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-pointer"
									onClick={() => setDetailsModal({ isOpen: true, attendee })}
								>
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
								<td 
									className="px-6 py-4 whitespace-nowrap cursor-pointer"
									onClick={() => setDetailsModal({ isOpen: true, attendee })}
								>
									<div className="text-sm font-medium text-gray-900 dark:text-white">
										{attendee.name}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{attendee.registration}
									</div>
								</td>
								<td 
									className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-100 cursor-pointer"
									onClick={() => setDetailsModal({ isOpen: true, attendee })}
								>
									{new Date(attendee.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</td>
								<td 
									className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-100 cursor-pointer"
									onClick={() => setDetailsModal({ isOpen: true, attendee })}
								>
									{attendee.early_leave ? (
										new Date(attendee.early_leave_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
									) : (
										'-'
									)}
								</td>
								{!isFinished && (
									<td className="px-6 py-4 whitespace-nowrap text-sm text-center">
										<div className="flex justify-center gap-2">
											{!attendee.early_leave && (
												<Tooltip content="Registrar saída antecipada">
													<button
														onClick={() => setEarlyLeaveAlert({ isOpen: true, attendeeId: attendee.id })}
														className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-300 dark:hover:text-yellow-200"
													>
														<ClockIcon className="h-5 w-5" />
													</button>
												</Tooltip>
											)}
											{!attendee.early_leave && (
												<Tooltip content="Remover presença">
													<button
														onClick={() => setDeleteAlert({ isOpen: true, attendeeId: attendee.id })}
														className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
													>
														<TrashIcon className="h-5 w-5" />
													</button>
												</Tooltip>
											)}
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

			<Modal
				isOpen={detailsModal.isOpen}
				onClose={() => setDetailsModal({ isOpen: false, attendee: null })}
				title="Detalhes do Participante"
				size="lg"
			>
				{detailsModal.attendee && (
					<div className="space-y-6">
						<div className="flex items-start gap-6">
							{/* Foto */}
							<div className="flex-shrink-0">
								{detailsModal.attendee.photo ? (
									<img
										src={`${API_URL}/uploads/${detailsModal.attendee.photo}`}
										alt={`Foto de ${detailsModal.attendee.name}`}
										className="w-24 h-24 rounded-full object-cover"
									/>
								) : (
									<div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
										<span className="text-gray-500 dark:text-gray-400 text-3xl">
											{detailsModal.attendee.name.charAt(0)}
										</span>
									</div>
								)}
							</div>

							{/* Informações */}
							<div className="flex-1 min-w-0">
								<h3 className="text-lg font-medium text-gray-900 dark:text-white">
									{detailsModal.attendee.name}
								</h3>
								<div className="mt-1 grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Matrícula
										</p>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{detailsModal.attendee.registration}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Unidade
										</p>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{detailsModal.attendee.unit}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Cargo
										</p>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{detailsModal.attendee.position}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Tipo de Registro
										</p>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{detailsModal.attendee.type}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Horário de Entrada
										</p>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{new Date(detailsModal.attendee.timestamp).toLocaleTimeString([], { 
												hour: '2-digit', 
												minute: '2-digit' 
											})}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Horário de Saída
										</p>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{detailsModal.attendee.early_leave ? (
												new Date(detailsModal.attendee.early_leave_time).toLocaleTimeString([], { 
													hour: '2-digit', 
													minute: '2-digit' 
												})
											) : (
												'-'
											)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
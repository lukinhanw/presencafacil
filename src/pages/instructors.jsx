import { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/General/datatable';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import ConfirmationDialog from '../components/General/confirmationDialog';
import InstructorForm from '../components/Instructor/instructorForm';
import InstructorFilters from '../components/Instructor/instructorFilters';
import { getInstructors, createInstructor, updateInstructor, deleteInstructor, toggleInstructorStatus } from '../services/instructorService';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';
import Tooltip from '../components/General/Tooltip';

export default function Instructors() {
	const [instructors, setInstructors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		units: [],
		positions: []
	});
	const [selectedInstructor, setSelectedInstructor] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, instructor: null });
	const [statusAlert, setStatusAlert] = useState({ isOpen: false, instructor: null });
	const { hasRole } = useAuth();
	const isAdmin = hasRole('ADMIN_ROLE');

	const fetchInstructors = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await getInstructors({
				search: filters.search,
				units: filters.units?.map(u => u.value) || [],
				positions: filters.positions?.map(p => p.value) || []
			});
			setInstructors(data);
		} catch (error) {
			showToast.error('Erro', error.message || 'Não foi possível carregar os instrutores');
		} finally {
			setIsLoading(false);
		}
	}, [filters]);

	useEffect(() => {
		fetchInstructors();
	}, [fetchInstructors]);

	const handleOpenModal = (instructor = null) => {
		setSelectedInstructor(instructor);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedInstructor(null);
		setIsModalOpen(false);
	};

	const handleSubmit = async (data) => {
		try {
			setIsLoading(true);
			if (selectedInstructor) {
				await updateInstructor(selectedInstructor.id, data);
				showToast.success('Sucesso', 'Instrutor atualizado com sucesso!');
			} else {
				await createInstructor(data);
				showToast.success('Sucesso', 'Instrutor cadastrado com sucesso!');
			}
			handleCloseModal();
			fetchInstructors();
		} catch (error) {
			showToast.error('Erro', error.message || 'Erro ao salvar instrutor');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteInstructor(deleteAlert.instructor.id);
			showToast.success('Sucesso', 'Instrutor excluído permanentemente!');
			setDeleteAlert({ isOpen: false, instructor: null });
			fetchInstructors();
		} catch (error) {
			showToast.error('Erro', error.message || 'Não foi possível excluir o instrutor');
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleStatus = async () => {
		try {
			setIsLoading(true);
			await toggleInstructorStatus(statusAlert.instructor.id);
			showToast.success('Sucesso', `Instrutor ${statusAlert.instructor.isActive ? 'desativado' : 'ativado'} com sucesso!`);
			setStatusAlert({ isOpen: false, instructor: null });
			fetchInstructors();
		} catch (error) {
			showToast.error('Erro', error.message || 'Não foi possível alterar o status do instrutor');
		} finally {
			setIsLoading(false);
		}
	};

	const columns = [
		{
			accessorKey: 'registration',
			header: 'Matrícula',
			cell: (row) => row.registration
		},
		{
			accessorKey: 'name',
			header: 'Nome',
			cell: (row) => row.name
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: (row) => row.email
		},
		{
			accessorKey: 'unit',
			header: 'Unidade',
			cell: (row) => row.unit
		},
		{
			accessorKey: 'position',
			header: 'Cargo',
			cell: (row) => row.position
		},
		{
			accessorKey: 'isActive',
			header: 'Status',
			cell: (row) => (
				<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
					row.isActive
						? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
						: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
					}`}>
					{row.isActive ? 'Ativo' : 'Inativo'}
				</span>
			)
		}
	];

	const actions = (row) => isAdmin ? (
		<>
			<Tooltip content="Editar instrutor">
				<button
					onClick={() => handleOpenModal(row)}
					className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
				>
					<PencilIcon className="h-5 w-5" />
				</button>
			</Tooltip>
			<Tooltip content={row.isActive ? "Desativar instrutor" : "Ativar instrutor"}>
				<button
					onClick={() => setStatusAlert({ isOpen: true, instructor: row })}
					className={`${row.isActive
							? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
							: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
						}`}
				>
					{row.isActive ? (
						<XCircleIcon className="h-5 w-5" />
					) : (
						<CheckCircleIcon className="h-5 w-5" />
					)}
				</button>
			</Tooltip>
			<Tooltip content="Excluir instrutor permanentemente">
				<button
					onClick={() => setDeleteAlert({ isOpen: true, instructor: row })}
					className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
				>
					<TrashIcon className="h-5 w-5" />
				</button>
			</Tooltip>
		</>
	) : null;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Instrutores
				</h1>
				{isAdmin && (
					<button
						onClick={() => handleOpenModal()}
						className="btn-gradient flex items-center"
					>
						<PlusIcon className="h-5 w-5 mr-2" />
						Novo Instrutor
					</button>
				)}
			</div>

			<InstructorFilters
				filters={filters}
				onFilterChange={setFilters}
			/>

			<DataTable
				columns={columns}
				data={instructors}
				actions={actions}
				isLoading={isLoading}
				rowClassName={(row) => !row.isActive ? 'opacity-60 dark:opacity-50' : ''}
			/>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedInstructor ? 'Editar Instrutor' : 'Novo Instrutor'}
				size="xl"
			>
				<InstructorForm
					onSubmit={handleSubmit}
					initialData={selectedInstructor}
					isLoading={isLoading}
				/>
			</Modal>

			<Alert
				isOpen={statusAlert.isOpen}
				onClose={() => setStatusAlert({ isOpen: false, instructor: null })}
				onConfirm={handleToggleStatus}
				title={statusAlert.instructor?.isActive ? "Desativar Instrutor" : "Ativar Instrutor"}
				message={statusAlert.instructor?.isActive 
					? `Tem certeza que deseja desativar o instrutor ${statusAlert.instructor?.name}?` 
					: `Tem certeza que deseja ativar o instrutor ${statusAlert.instructor?.name}?`}
				type={statusAlert.instructor?.isActive ? "warning" : "success"}
			/>

			<ConfirmationDialog
				isOpen={deleteAlert.isOpen}
				onClose={() => setDeleteAlert({ isOpen: false, instructor: null })}
				onConfirm={handleDelete}
				title="Excluir Instrutor Permanentemente"
				message={`Esta ação não pode ser desfeita. O instrutor ${deleteAlert.instructor?.name} será excluído permanentemente do sistema, junto com todos os seus dados e histórico.`}
				confirmationText="eu confirmo"
				confirmText="Excluir Permanentemente"
				type="danger"
			/>
		</div>
	);
}
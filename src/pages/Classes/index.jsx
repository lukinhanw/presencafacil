import { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import ClassForm from '../../components/ClassForm';
import ClassFilters from '../../components/ClassFilters';
import { getClasses, createClass, updateClass, deleteClass, CLASS_TYPES } from '../../services/classService';
import { getTrainings } from '../../services/trainingService';
import { getInstructors } from '../../services/instructorService';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../components/Toast';

export default function Classes() {
	const [classes, setClasses] = useState([]);
	const [trainings, setTrainings] = useState([]);
	const [instructors, setInstructors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		types: [],
		units: []
	});
	const [selectedClass, setSelectedClass] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, classId: null });
	const { hasRole } = useAuth();
	const isAdmin = hasRole('ADMIN_ROLE');

	const fetchClasses = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await getClasses({
				search: filters.search,
				types: filters.types?.map(t => t.value) || [],
				units: filters.units?.map(u => u.value) || []
			});
			setClasses(data);
		} catch (error) {
			showToast.error('Erro', 'Não foi possível carregar as aulas');
		} finally {
			setIsLoading(false);
		}
	}, [filters]);

	const fetchTrainings = async () => {
		try {
			const data = await getTrainings();
			setTrainings(data);
		} catch (error) {
			showToast.error('Erro', 'Não foi possível carregar os treinamentos');
		}
	};

	const fetchInstructors = async () => {
		try {
			const data = await getInstructors();
			setInstructors(data);
		} catch (error) {
			showToast.error('Erro', 'Não foi possível carregar os instrutores');
		}
	};

	useEffect(() => {
		fetchClasses();
		fetchTrainings();
		fetchInstructors();
	}, [fetchClasses]);

	const handleOpenModal = (classData = null) => {
		setSelectedClass(classData);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedClass(null);
		setIsModalOpen(false);
	};

	const handleSubmit = async (data) => {
		try {
			setIsLoading(true);
			if (selectedClass) {
				await updateClass(selectedClass.id, data);
				showToast.success('Sucesso', 'Aula atualizada com sucesso!');
			} else {
				await createClass(data);
				showToast.success('Sucesso', 'Aula criada com sucesso!');
			}
			handleCloseModal();
			fetchClasses();
		} catch (error) {
			showToast.error('Erro', error.message || 'Erro ao salvar aula');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteClass(deleteAlert.classId);
			showToast.success('Sucesso', 'Aula excluída com sucesso!');
			setDeleteAlert({ isOpen: false, classId: null });
			fetchClasses();
		} catch (error) {
			showToast.error('Erro', 'Não foi possível excluir a aula');
		} finally {
			setIsLoading(false);
		}
	};

	const columns = [
		{
			accessorKey: 'training.name',
			header: 'Nome',
			cell: (row) => row.training?.name || 'N/A'
		},
		{
			accessorKey: 'training.code',
			header: 'Código',
			cell: (row) => row.training?.code || 'N/A'
		},
		{
			accessorKey: 'training.duration',
			header: 'Duração',
			cell: (row) => row.training?.duration || 'N/A'
		},
		{
			accessorKey: 'training.provider',
			header: 'Fornecedor',
			cell: (row) => row.training?.provider || 'N/A'
		},
		{
			accessorKey: 'training.classification',
			header: 'Classificação',
			cell: (row) => row.training?.classification || 'N/A'
		},
		{
			accessorKey: 'type',
			header: 'Tipo',
			cell: (row) => CLASS_TYPES.find(t => t.value === row.type)?.label || row.type
		},
		{
			accessorKey: 'date_start',
			header: 'Data Início',
			cell: (row) => row.date_start ? new Date(row.date_start).toLocaleString() : 'N/A'
		},
		{
			accessorKey: 'date_end',
			header: 'Data Fim',
			cell: (row) => row.date_end ? new Date(row.date_end).toLocaleString() : 'N/A'
		},
		{
			accessorKey: 'presents',
			header: 'Presentes',
			cell: (row) => row.presents || 'N/A'
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: (row) => row.status || 'N/A'
		},
		{
			accessorKey: 'instructor.name',
			header: 'Instrutor',
			cell: (row) => row.instructor?.name || 'N/A'
		},
		{
			accessorKey: 'unit',
			header: 'Unidade',
			cell: (row) => row.unit || 'N/A'
		}
	];

	const actions = (row) => isAdmin ? (
		<>
			<button
				onClick={() => handleOpenModal(row)}
				className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
			>
				<PencilIcon className="h-5 w-5" />
			</button>
			<button
				onClick={() => setDeleteAlert({ isOpen: true, classId: row.id })}
				className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
			>
				<TrashIcon className="h-5 w-5" />
			</button>
		</>
	) : null;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Aulas
				</h1>
				<button
					onClick={() => handleOpenModal()}
					className="btn-gradient flex items-center"
				>
					<PlusIcon className="h-5 w-5 mr-2" />
					Nova Aula
				</button>
			</div>

			<ClassFilters
				filters={filters}
				onFilterChange={setFilters}
			/>

			<DataTable
				columns={columns}
				data={classes}
				actions={actions}
				isLoading={isLoading}
			/>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedClass ? 'Editar Aula' : 'Nova Aula'}
				size="xl"
			>
				<ClassForm
					onSubmit={handleSubmit}
					initialData={selectedClass}
					isLoading={isLoading}
					trainings={trainings}
					instructors={instructors}
				/>
			</Modal>

			<Alert
				isOpen={deleteAlert.isOpen}
				onClose={() => setDeleteAlert({ isOpen: false, classId: null })}
				onConfirm={handleDelete}
				title="Excluir Aula"
				message="Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita."
				type="danger"
			/>
		</div>
	);
}
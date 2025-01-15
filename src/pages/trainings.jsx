import { useState, useEffect, useCallback, useMemo } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/General/datatable';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import TrainingForm from '../components/Training/trainingForm';
import TrainingFilters from '../components/Training/trainingFilters';
import { getTrainings, createTraining, updateTraining, deleteTraining } from '../services/trainingService';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';

export default function Trainings() {
	const [trainings, setTrainings] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		providers: [],
		classifications: []
	});
	const [selectedTraining, setSelectedTraining] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, trainingId: null });
	const { hasRole } = useAuth();
	const isAdmin = hasRole('ADMIN_ROLE');
	const [reloadKey, setReloadKey] = useState(0);

	const fetchTrainings = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await getTrainings({
				providers: filters.providers?.map(p => p.value) || [],
				classifications: filters.classifications?.map(c => c.value) || []
			});
			setTrainings(data);
		} catch (error) {
			showToast.error('Erro', 'Não foi possível carregar os treinamentos');
		} finally {
			setIsLoading(false);
		}
	}, [filters.providers, filters.classifications]);

	const filteredTrainings = useMemo(() => {
		if (!filters.search) return trainings;

		const searchTerm = filters.search.toLowerCase();
		return trainings.filter(training => 
			training.name.toLowerCase().includes(searchTerm) ||
			training.code.toLowerCase().includes(searchTerm) ||
			training.provider.toLowerCase().includes(searchTerm) ||
			training.classification.toLowerCase().includes(searchTerm)
		);
	}, [trainings, filters.search]);

	useEffect(() => {
		fetchTrainings();
	}, [fetchTrainings]);

	const handleOpenModal = (training = null) => {
		setSelectedTraining(training);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedTraining(null);
		setIsModalOpen(false);
	};

	const handleSubmit = async (data) => {
		try {
			setIsLoading(true);
			if (selectedTraining) {
				await updateTraining(selectedTraining.id, data);
				showToast.success('Sucesso', 'Treinamento atualizado com sucesso!');
			} else {
				await createTraining(data);
				showToast.success('Sucesso', 'Treinamento criado com sucesso!');
			}
			handleCloseModal();
			setReloadKey(prev => prev + 1);
			fetchTrainings();
		} catch (error) {
			showToast.error('Erro', error.message || 'Erro ao salvar treinamento');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteTraining(deleteAlert.trainingId);
			showToast.success('Sucesso', 'Treinamento excluído com sucesso!');
			setDeleteAlert({ isOpen: false, trainingId: null });
			fetchTrainings();
		} catch (error) {
			showToast.error('Erro', 'Não foi possível excluir o treinamento');
		} finally {
			setIsLoading(false);
		}
	};

	const columns = [
		{
			accessorKey: 'name',
			header: 'Nome',
			cell: (row) => row.name
		},
		{
			accessorKey: 'code',
			header: 'Código',
			cell: (row) => row.code
		},
		{
			accessorKey: 'duration',
			header: 'Duração',
			cell: (row) => row.duration
		},
		{
			accessorKey: 'provider',
			header: 'Fornecedor',
			cell: (row) => row.provider
		},
		{
			accessorKey: 'classification',
			header: 'Classificação',
			cell: (row) => row.classification
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
				onClick={() => setDeleteAlert({ isOpen: true, trainingId: row.id })}
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
					Treinamentos
				</h1>
				{isAdmin && (
					<button
						onClick={() => handleOpenModal()}
						className="btn-gradient flex items-center"
					>
						<PlusIcon className="h-5 w-5 mr-2" />
						Novo Treinamento
					</button>
				)}
			</div>

			<TrainingFilters
				filters={filters}
				onFilterChange={setFilters}
				reloadKey={reloadKey}
			/>

			<DataTable
				columns={columns}
				data={filteredTrainings}
				actions={actions}
				isLoading={isLoading}
			/>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedTraining ? 'Editar Treinamento' : 'Novo Treinamento'}
				size="xl"
			>
				<TrainingForm
					onSubmit={handleSubmit}
					initialData={selectedTraining}
					isLoading={isLoading}
				/>
			</Modal>

			<Alert
				isOpen={deleteAlert.isOpen}
				onClose={() => setDeleteAlert({ isOpen: false, trainingId: null })}
				onConfirm={handleDelete}
				title="Excluir Treinamento"
				message="Tem certeza que deseja excluir este treinamento? Esta ação não pode ser desfeita."
				type="danger"
			/>
		</div>
	);
}
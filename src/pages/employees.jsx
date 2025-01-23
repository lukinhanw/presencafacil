import { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/General/datatable';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import EmployeeForm from '../components/Employee/employeeForm';
import EmployeeFilters from '../components/Employee/employeeFilters';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';
import Tooltip from '../components/General/Tooltip';

export default function Employees() {
	const [employees, setEmployees] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		units: [],
		positions: []
	});
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, employeeId: null });
	const { hasRole } = useAuth();
	const isAdmin = hasRole('ADMIN_ROLE');

	const fetchEmployees = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await getEmployees({
				search: filters.search,
				units: filters.units?.map(u => u.value) || [],
				positions: filters.positions?.map(p => p.value) || []
			});
			setEmployees(data);
		} catch (error) {
			showToast.error('Erro', error.message || 'Não foi possível carregar os colaboradores');
		} finally {
			setIsLoading(false);
		}
	}, [filters]);

	useEffect(() => {
		fetchEmployees();
	}, [fetchEmployees]);

	const handleOpenModal = (employee = null) => {
		setSelectedEmployee(employee);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedEmployee(null);
		setIsModalOpen(false);
	};

	const handleSubmit = async (data) => {
		try {
			setIsLoading(true);
			if (selectedEmployee) {
				await updateEmployee(selectedEmployee.id, data);
				showToast.success('Sucesso', 'Colaborador atualizado com sucesso!');
			} else {
				await createEmployee(data);
				showToast.success('Sucesso', 'Colaborador cadastrado com sucesso!');
			}
			handleCloseModal();
			fetchEmployees();
		} catch (error) {
			showToast.error('Erro', error.message || 'Erro ao salvar colaborador');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteEmployee(deleteAlert.employeeId);
			showToast.success('Sucesso', 'Colaborador excluído com sucesso!');
			setDeleteAlert({ isOpen: false, employeeId: null });
			fetchEmployees();
		} catch (error) {
			showToast.error('Erro', 'Não foi possível excluir o colaborador');
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
			accessorKey: 'unit',
			header: 'Unidade',
			cell: (row) => row.unit
		},
		{
			accessorKey: 'position',
			header: 'Cargo',
			cell: (row) => row.position
		}
	];

	const actions = (row) => isAdmin ? (
		<div className="flex space-x-2">
			<Tooltip content="Editar colaborador">
				<button
					onClick={() => handleOpenModal(row)}
					className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
				>
					<PencilIcon className="h-5 w-5" />
				</button>
			</Tooltip>
			<Tooltip content="Excluir colaborador">
				<button
					onClick={() => setDeleteAlert({ isOpen: true, employeeId: row.id })}
					className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
				>
					<TrashIcon className="h-5 w-5" />
				</button>
			</Tooltip>
		</div>
	) : null;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Colaboradores
				</h1>
				{isAdmin && (
					<Tooltip content="Novo colaborador">
						<button
							onClick={() => handleOpenModal()}
							className="btn-gradient flex items-center"
						>
							<PlusIcon className="h-5 w-5 mr-2" />
							Novo Colaborador
						</button>
					</Tooltip>
				)}
			</div>

			<EmployeeFilters
				filters={filters}
				onFilterChange={setFilters}
			/>

			<DataTable
				columns={columns}
				data={employees}
				actions={actions}
				isLoading={isLoading}
			/>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedEmployee ? 'Editar Colaborador' : 'Novo Colaborador'}
				size="xl"
			>
				<EmployeeForm
					onSubmit={handleSubmit}
					initialData={selectedEmployee}
					isLoading={isLoading}
				/>
			</Modal>

			<Alert
				isOpen={deleteAlert.isOpen}
				onClose={() => setDeleteAlert({ isOpen: false, employeeId: null })}
				onConfirm={handleDelete}
				title="Excluir Colaborador"
				message="Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita."
				type="danger"
			/>
		</div>
	);
}
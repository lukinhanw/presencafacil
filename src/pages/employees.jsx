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

export default function Employees() {
	const [employees, setEmployees] = useState([]);
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		pages: 1
	});
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		unit: null,
		position: null
	});
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, employeeId: null });
	const { hasRole } = useAuth();
	const isAdmin = hasRole('ADMIN_ROLE');

	const fetchEmployees = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await getEmployees({
				unit: filters.unit?.value,
				position: filters.position?.value
			});
			setEmployees(response.data);
			setFilteredEmployees(response.data);
			setPagination(prev => ({
				...prev,
				total: response.data.length,
				pages: Math.ceil(response.data.length / prev.limit)
			}));
		} catch (error) {
			showToast.error('Erro', 'Não foi possível carregar os colaboradores');
		} finally {
			setIsLoading(false);
		}
	}, [filters.unit, filters.position]);

	useEffect(() => {
		fetchEmployees();
	}, [fetchEmployees]);

	// Efeito para filtrar localmente os colaboradores
	useEffect(() => {
		if (!employees.length) return;

		let filtered = [...employees];

		// Aplica filtro de busca
		if (filters.search) {
			const searchTerm = filters.search.toLowerCase();
			filtered = filtered.filter(employee => 
				employee.name.toLowerCase().includes(searchTerm) ||
				employee.registration.toLowerCase().includes(searchTerm)
			);
		}

		setFilteredEmployees(filtered);
		setPagination(prev => ({
			...prev,
			total: filtered.length,
			pages: Math.ceil(filtered.length / prev.limit),
			page: 1
		}));
	}, [filters.search, employees]);

	// Função para pegar os itens da página atual
	const getCurrentPageItems = useCallback(() => {
		const start = (pagination.page - 1) * pagination.limit;
		const end = start + pagination.limit;
		return filteredEmployees.slice(start, end);
	}, [filteredEmployees, pagination.page, pagination.limit]);

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

	const handlePageChange = (newPage) => {
		setPagination(prev => ({ ...prev, page: newPage }));
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
		<>
			<button
				onClick={() => handleOpenModal(row)}
				className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
			>
				<PencilIcon className="h-5 w-5" />
			</button>
			<button
				onClick={() => setDeleteAlert({ isOpen: true, employeeId: row.id })}
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
					Colaboradores
				</h1>
				{isAdmin && (
					<button
						onClick={() => handleOpenModal()}
						className="btn-gradient flex items-center"
					>
						<PlusIcon className="h-5 w-5 mr-2" />
						Novo Colaborador
					</button>
				)}
			</div>

			<EmployeeFilters
				filters={filters}
				onFilterChange={(newFilters) => {
					setFilters(newFilters);
					setPagination(prev => ({ ...prev, page: 1 }));
				}}
			/>

			<DataTable
				columns={columns}
				data={getCurrentPageItems()}
				actions={actions}
				isLoading={isLoading}
				pagination={pagination}
				onPageChange={handlePageChange}
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
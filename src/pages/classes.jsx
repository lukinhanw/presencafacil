import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiMapPin, FiAward, FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import ClassForm from '../components/Class/ClassForm';
import ClassFilters from '../components/Class/ClassFilters';
import { getClasses, createClass, deleteClass, CLASS_TYPES } from '../services/classService';
import { getTrainings } from '../services/trainingService';
import { getInstructors } from '../services/instructorService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { showToast } from '../components/General/toast';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../utils/dateUtils';

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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, classId: null });
	const { hasRole } = useAuth();
	const navigate = useNavigate();
	const isAdmin = hasRole('ADMIN_ROLE');
	const { isDark } = useTheme();

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

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSubmit = async (data) => {
		try {
			setIsLoading(true);
			await createClass(data);
			showToast.success('Sucesso', 'Aula criada com sucesso!');
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

	const handleEnterClass = (classId) => {
		navigate(`/aulas/${classId}`);
	};

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Aulas
				</h1>
				{isAdmin && (
					<button
						onClick={handleOpenModal}
						className="btn-gradient flex items-center gap-2"
					>
						<FiPlus className="h-5 w-5" />
						Nova Aula
					</button>
				)}
			</div>

			<ClassFilters
				filters={filters}
				onFilterChange={setFilters}
			/>

			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} className="animate-pulse">
							<div className="glass-card h-64 p-4">
								{/* Imagem */}
								<div className="w-full h-32 bg-gray-300/30 rounded-lg mb-4"></div>
								{/* Título */}
								<div className="h-4 bg-gray-300/30 rounded w-3/4 mb-4"></div>
								{/* Linhas de texto */}
								<div className="space-y-3">
									<div className="h-3 bg-gray-300/30 rounded"></div>
									<div className="h-3 bg-gray-300/30 rounded w-5/6"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : classes.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 glass-card">
					<p className="text-gray-500 dark:text-gray-400 text-lg">
						Nenhuma aula encontrada
					</p>
				</div>
			) : (
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{classes.map((classItem) => (
						<motion.div
							key={classItem.id}
							variants={item}
							className={`
								relative overflow-hidden rounded-xl
								${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}
								backdrop-blur-lg border border-gray-200 dark:border-gray-700
								hover:shadow-lg transition-all duration-300
								group
							`}
						>
							{/* Barra de Status */}
							<div className={`
								absolute top-0 left-0 w-1.5 h-full
								${getStatusColor(classItem.status)}
							`} />

							<div className="p-6">
								{/* Cabeçalho */}
								<div className="flex justify-between items-start mb-4">
									<div>
										<span className={`
											px-3 py-1 rounded-full text-xs font-medium
											${getTypeStyle(classItem.type)}
										`}>
											{classItem.type}
										</span>
										<h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-white">
											{classItem.training?.name || 'N/A'}
										</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Código: {classItem.training?.code || 'N/A'}
										</p>
									</div>
								</div>

								{/* Informações */}
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<FiUsers className="text-indigo-500" />
										<span className="text-sm">{classItem.presents} presentes</span>
									</div>

									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<FiClock className="text-indigo-500" />
										<span className="text-sm">
											{formatDateTime(classItem.date_start)}
										</span>
									</div>

									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<FiMapPin className="text-indigo-500" />
										<span className="text-sm">{classItem.unit}</span>
									</div>

									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<FiAward className="text-indigo-500" />
										<span className="text-sm">{classItem.instructor?.name || 'N/A'}</span>
									</div>
								</div>

								{/* Ações */}
								<div className="flex justify-end gap-3 mt-6">
									<button
										onClick={() => handleEnterClass(classItem.id)}
										className="btn-primary-outline px-4 py-2 flex items-center gap-2"
									>
										<span>Acessar</span>
										<FiArrowRight className="h-4 w-4" />
									</button>

									{isAdmin && (
										<button
											onClick={() => setDeleteAlert({ isOpen: true, classId: classItem.id })}
											className="btn-danger-outline px-4 py-2 flex items-center gap-2"
										>
											<FiTrash2 className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title="Nova Aula"
				size="xl"
			>
				<ClassForm
					onSubmit={handleSubmit}
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

// Funções auxiliares para estilização
const getStatusColor = (status) => {
	const colors = {
		active: 'bg-green-500',
		pending: 'bg-yellow-500',
		finished: 'bg-blue-500',
		cancelled: 'bg-red-500'
	};
	return colors[status] || 'bg-gray-500';
};

const getTypeStyle = (type) => {
	const styles = {
		Portfolio: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		External: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		DDS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		Others: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
	};
	return styles[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};
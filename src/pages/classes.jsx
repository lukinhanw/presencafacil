import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiMapPin, FiAward, FiPlus, FiTrash2, FiArrowRight, FiGrid, FiList } from 'react-icons/fi';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import ClassForm from '../components/Class/classForm';
import ClassFilters from '../components/Class/classFilters';
import { getClasses, createClass, deleteClass, CLASS_TYPES } from '../services/lessonService';
import { getTrainings } from '../services/trainingService';
import { getInstructors } from '../services/instructorService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { showToast } from '../components/General/toast';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../utils/dateUtils';

export default function Classes() {
	const [classes, setClasses] = useState([]);
	const [filteredClasses, setFilteredClasses] = useState([]);
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
	const [viewMode, setViewMode] = useState('list');

	const fetchClasses = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data } = await getClasses({
				types: filters.types?.length > 0 ? filters.types.map(t => t.value) : undefined,
				units: filters.units?.length > 0 ? filters.units.map(u => u.value) : undefined,
				page: 1,
				limit: 10
			});
			setClasses(data);
			setFilteredClasses(data);
		} catch (error) {
			showToast.error('Erro', 'Não foi possível carregar as aulas');
		} finally {
			setIsLoading(false);
		}
	}, [filters.types, filters.units]);

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

	// Função para filtrar localmente
	useEffect(() => {
		if (!filters.search) {
			setFilteredClasses(classes);
			return;
		}

		const searchTerm = filters.search.toLowerCase();
		const filtered = classes.filter(classItem => {
			return (
				classItem.training_data?.name?.toLowerCase().includes(searchTerm) ||
				classItem.training_data?.code?.toLowerCase().includes(searchTerm) ||
				classItem.instructor_name?.toLowerCase().includes(searchTerm) ||
				classItem.unit?.toLowerCase().includes(searchTerm) ||
				classItem.type?.toLowerCase().includes(searchTerm)
			);
		});

		setFilteredClasses(filtered);
	}, [filters.search, classes]);

	return (
		<div className="space-y-6 p-6">
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<div className="flex items-center gap-4">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Aulas
					</h1>
					<div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
						<button
							onClick={() => setViewMode('list')}
							className={`p-1.5 rounded-md transition-colors ${
								viewMode === 'list'
									? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
									: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
							}`}
							title="Visualização em lista"
						>
							<FiList className="h-5 w-5" />
						</button>
						<button
							onClick={() => setViewMode('grid')}
							className={`p-1.5 rounded-md transition-colors ${
								viewMode === 'grid'
									? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
									: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
							}`}
							title="Visualização em grid"
						>
							<FiGrid className="h-5 w-5" />
						</button>
					</div>
				</div>
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
				<div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
					{[1, 2, 3, 4].map((i) => (
						<div 
							key={i} 
							className={`
								relative overflow-hidden rounded-lg
								${isDark 
									? 'bg-gray-800/60' 
									: 'bg-gray-50/95'
								}
								backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50
								${viewMode === 'grid' ? 'flex flex-col p-4 h-auto' : 'flex items-center h-20'}
							`}
						>
							{/* Barra lateral */}
							<div className="w-1 self-stretch bg-gray-200 dark:bg-gray-700 animate-pulse" />

							<div className="flex-1 px-4 flex items-center gap-6">
								{/* Tag de Tipo */}
								<div className="flex-shrink-0">
									<div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
								</div>

								{/* Código */}
								<div className="flex-shrink-0 w-24">
									<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
								</div>

								{/* Nome do Treinamento */}
								<div className="flex-1 min-w-0">
									<div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
								</div>

								{/* Informações em linha */}
								<div className="flex items-center gap-6 flex-shrink-0">
									{/* Presentes */}
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
										<div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
									</div>

									{/* Unidade */}
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
										<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
									</div>

									{/* Instrutor */}
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
										<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
									</div>

									{/* Data/Hora */}
									<div className="flex items-center gap-2">
										<div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
										<div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
									</div>
								</div>

								{/* Ações */}
								<div className="flex items-center gap-2 flex-shrink-0 ml-4">
									<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
									<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : filteredClasses.length === 0 ? (
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
					className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}
				>
					{filteredClasses.map((classItem) => (
						<motion.div
							key={classItem.id}
							variants={item}
							className={`
								relative overflow-hidden rounded-lg
								${isDark 
									? 'bg-gray-800/60 hover:bg-gray-800/70' 
									: 'bg-gray-50/95 hover:bg-gray-50/100'
								}
								backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50
								hover:shadow-lg transition-all duration-300
								group
								${viewMode === 'grid' ? 'flex flex-col p-4' : 'flex items-center h-20'}
							`}
						>
							{viewMode === 'grid' ? (
								<>
									{/* Visualização em Grid */}
									<div className="flex items-center gap-2 mb-3">
										<span className={`${getTypeStyle(classItem.type)}`}>
											{classItem.type}
										</span>
										<span className="text-sm text-gray-500 dark:text-gray-400">
											{classItem.training_data?.code || 'N/A'}
										</span>
									</div>

									<h3 className="text-base font-medium text-gray-900 dark:text-white mb-3 line-clamp-2">
										{classItem.training_data?.name || 'N/A'}
									</h3>

									<div className="space-y-2 flex-1">
										<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
											<FiUsers className="h-4 w-4 text-primary-500 dark:text-primary-400" />
											<span className="text-sm">{classItem.presents} presentes</span>
										</div>

										<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
											<FiMapPin className="h-4 w-4 text-primary-500 dark:text-primary-400" />
											<span className="text-sm">{classItem.unit}</span>
										</div>

										<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
											<FiAward className="h-4 w-4 text-primary-500 dark:text-primary-400" />
											<span className="text-sm truncate">
												{classItem.instructor?.name || 'N/A'}
											</span>
										</div>

										<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
											<FiClock className="h-4 w-4 text-primary-500 dark:text-primary-400" />
											<span className="text-sm">
												{formatDateTime(classItem.date_start)}
											</span>
										</div>
									</div>

									<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
										<button
											onClick={() => handleEnterClass(classItem.id)}
											className="btn-primary flex items-center gap-1 px-3 py-1.5 text-sm"
										>
											<span>Acessar</span>
											<FiArrowRight className="h-4 w-4" />
										</button>

										{isAdmin && (
											<button
												onClick={() => setDeleteAlert({ isOpen: true, classId: classItem.id })}
												className="btn-danger-icon p-1.5 rounded-lg"
												title="Excluir aula"
											>
												<FiTrash2 className="h-4 w-4" />
											</button>
										)}
									</div>
								</>
							) : (
								<>
									{/* Visualização em Lista (código existente) */}
									<div className={`w-1 self-stretch ${getStatusColor(classItem.type)}`} />

									<div className="flex-1 px-4 flex items-center gap-6">
										{/* Tag de Tipo */}
										<div className="flex-shrink-0">
											<span className={`${getTypeStyle(classItem.type)}`}>
												{classItem.type}
											</span>
										</div>

										{/* Código */}
										<div className="flex-shrink-0 w-24">
											<span className="text-sm text-gray-500 dark:text-gray-400">
												{classItem.training_data?.code || 'N/A'}
											</span>
										</div>

										{/* Nome do Treinamento */}
										<div className="flex-1 min-w-0">
											<h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
												{classItem.training_data?.name || 'N/A'}
											</h3>
										</div>

										{/* Informações em linha */}
										<div className="flex items-center gap-6 flex-shrink-0">
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
												<FiUsers className="h-4 w-4 text-primary-500 dark:text-primary-400" />
												<span className="text-sm">{classItem.presents}</span>
											</div>

											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
												<FiMapPin className="h-4 w-4 text-primary-500 dark:text-primary-400" />
												<span className="text-sm">{classItem.unit}</span>
											</div>

											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
												<FiAward className="h-4 w-4 text-primary-500 dark:text-primary-400" />
												<span className="text-sm whitespace-nowrap">
													{classItem.instructor?.name || 'N/A'}
												</span>
											</div>

											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
												<FiClock className="h-4 w-4 text-primary-500 dark:text-primary-400" />
												<span className="text-sm whitespace-nowrap">
													{formatDateTime(classItem.date_start)}
												</span>
											</div>
										</div>

										{/* Ações */}
										<div className="flex items-center gap-2 flex-shrink-0 ml-4">
											<button
												onClick={() => handleEnterClass(classItem.id)}
												className="btn-primary flex items-center gap-1 px-3 py-1.5 text-sm"
											>
												<span>Acessar</span>
												<FiArrowRight className="h-4 w-4" />
											</button>

											{isAdmin && (
												<button
													onClick={() => setDeleteAlert({ isOpen: true, classId: classItem.id })}
													className="btn-danger-icon p-1.5 rounded-lg"
													title="Excluir aula"
												>
													<FiTrash2 className="h-4 w-4" />
												</button>
											)}
										</div>
									</div>
								</>
							)}
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
const getStatusColor = (type) => {
	const colors = {
		Portfolio: 'bg-purple-500',
		External: 'bg-blue-500',
		DDS: 'bg-green-500',
		Others: 'bg-orange-500'
	};
	return colors[type] || 'bg-gray-500';
};

const getTypeStyle = (type) => {
	const styles = {
		Portfolio: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20',
		External: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
		DDS: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20',
		Others: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20'
	};
	return `type-badge ${styles[type] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/20'}`;
};
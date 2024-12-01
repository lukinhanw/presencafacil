import { useState } from 'react';
import Select from 'react-select';
import { useTheme } from '../../../contexts/ThemeContext';
import { searchEmployees } from '../../../services/employeeService';
import { registerAttendance } from '../../../services/classService';
import { selectStyles } from '../../../components/shared/selectStyles';
import { selectStylesDark } from '../../../components/shared/selectStylesDark';
import WebcamCapture from './WebcamCapture';
import { showToast } from '../../../components/Toast';

export default function ManualAttendance({ classId, onSuccess }) {
	const { isDark } = useTheme();
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showCamera, setShowCamera] = useState(false);
	const stylesSelect = isDark ? selectStylesDark : selectStyles;

	const loadEmployeeOptions = async (inputValue) => {
		try {
			const employees = await searchEmployees(inputValue);
			return employees.map(emp => ({
				value: emp.id,
				label: `${emp.name} (${emp.registration})`
			}));
		} catch (error) {
			showToast.error('Erro', 'Não foi possível buscar os colaboradores');
			return [];
		}
	};

	const handlePhotoCapture = async (photoData) => {
		try {
			setIsLoading(true);
			await registerAttendance(classId, {
				employeeId: selectedEmployee.value,
				photo: photoData,
				type: 'Manual'
			});
			showToast.success('Sucesso', 'Presença registrada com sucesso!');
			onSuccess();
		} catch (error) {
			showToast.error('Erro', 'Não foi possível registrar a presença');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{!showCamera ? (
				<>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Buscar Colaborador
						</label>
						<Select
							value={selectedEmployee}
							onChange={setSelectedEmployee}
							loadOptions={loadEmployeeOptions}
							isAsync
							isClearable
							styles={stylesSelect}
							placeholder="Digite o nome ou matrícula..."
							noOptionsMessage={() => "Digite para buscar..."}
							loadingMessage={() => "Buscando..."}
						/>
					</div>

					<div className="flex justify-end">
						<button
							onClick={() => setShowCamera(true)}
							disabled={!selectedEmployee || isLoading}
							className="btn-gradient"
						>
							Tirar Foto
						</button>
					</div>
				</>
			) : (
				<WebcamCapture
					onCapture={handlePhotoCapture}
					onCancel={() => setShowCamera(false)}
					isLoading={isLoading}
				/>
			)}
		</div>
	);
}
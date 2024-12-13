import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useTheme } from '../../contexts/ThemeContext';
import { registerAttendance } from '../../services/classService';
import { searchEmployees } from '../../services/employeeService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import WebcamCapture from './WebcamCapture';
import { showToast } from '../General/toast';

export default function ManualAttendance({ classId, onSuccess }) {
	const { isDark } = useTheme();
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showCamera, setShowCamera] = useState(false);

	const stylesSelect = isDark ? selectStylesDark : selectStyles;

	const loadOptions = async (inputValue) => {
		if (!inputValue || inputValue.length < 2) {
			return [];
		}

		try {
			const employees = await searchEmployees(inputValue);
			return employees.map(emp => ({
				value: emp.id,
				label: `${emp.name} (${emp.registration})`,
				employee: emp
			}));
		} catch (error) {
			showToast.error('Erro', 'Não foi possível buscar os colaboradores');
			return [];
		}
	};

	const handlePhotoCapture = async (photoData) => {
		if (!selectedEmployee?.employee) {
			showToast.error('Erro', 'Selecione um colaborador primeiro');
			return;
		}

		try {
			setIsLoading(true);
			await registerAttendance(classId, {
				id: selectedEmployee.employee.id,
				name: selectedEmployee.employee.name,
				registration: selectedEmployee.employee.registration,
				photo: photoData,
				type: 'Manual'
			});
			showToast.success('Sucesso', 'Presença registrada com sucesso!');
			onSuccess();
		} catch (error) {
			showToast.error('Erro', error.message || 'Não foi possível registrar a presença');
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmployeeSelect = (option) => {
		setSelectedEmployee(option);
	};

	if (showCamera) {
		return (
			<WebcamCapture
				onCapture={handlePhotoCapture}
				onCancel={() => setShowCamera(false)}
				isLoading={isLoading}
			/>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Buscar Colaborador
				</label>
				<AsyncSelect
					value={selectedEmployee}
					onChange={handleEmployeeSelect}
					loadOptions={loadOptions}
					styles={stylesSelect}
					placeholder="Digite o nome ou matrícula..."
					loadingMessage={() => "Buscando..."}
					noOptionsMessage={({ inputValue }) =>
						!inputValue ? "Digite para buscar..."
							: inputValue.length < 2
								? "Digite pelo menos 2 caracteres"
								: "Nenhum colaborador encontrado"
					}
					menuPortalTarget={document.body}
					menuPosition={'fixed'}
					className="min-w-[250px]"
					isClearable
					defaultOptions={false}
					debounceTimeout={300}
				/>
			</div>

			<div className="flex justify-end">
				<button
					onClick={() => setShowCamera(true)}
					disabled={!selectedEmployee || isLoading}
					className="btn-gradient px-4 py-2 text-sm"
				>
					Tirar Foto
				</button>
			</div>
		</div>
	);
}
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';
import { getInstructorUnits, getInstructorPositions } from '../../services/instructorService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import { showToast } from '../General/toast';

export default function InstructorFilters({ filters, onFilterChange }) {
	const { isDark } = useTheme();
	const stylesSelect = isDark ? selectStylesDark : selectStyles;
	const [isLoading, setIsLoading] = useState(true);
	const [unitOptions, setUnitOptions] = useState([]);
	const [positionOptions, setPositionOptions] = useState([]);

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				setIsLoading(true);
				const [units, positions] = await Promise.all([
					getInstructorUnits(),
					getInstructorPositions()
				]);

				setUnitOptions(units.map(unit => ({ value: unit, label: unit })));
				setPositionOptions(positions.map(position => ({ value: position, label: position })));
			} catch (error) {
				showToast.error('Erro', 'Erro ao carregar opções de filtro');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOptions();
	}, []);

	return (
		<div className="glass-card p-4 space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Buscar
					</label>
					<input
						type="text"
						value={filters.search}
						onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
						placeholder="Buscar por nome ou matrícula..."
						className="input-field"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Unidades
					</label>
					<Select
						isMulti
						isLoading={isLoading}
						options={unitOptions}
						value={filters.units}
						onChange={(selected) => onFilterChange({ ...filters, units: selected })}
						styles={stylesSelect}
						menuPortalTarget={document.body}
						menuPosition={'fixed'}
						placeholder="Selecione as unidades"
						classNamePrefix="select"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Cargos
					</label>
					<Select
						isMulti
						isLoading={isLoading}
						options={positionOptions}
						value={filters.positions}
						onChange={(selected) => onFilterChange({ ...filters, positions: selected })}
						styles={stylesSelect}
						menuPortalTarget={document.body}
						menuPosition={'fixed'}
						placeholder="Selecione os cargos"
						classNamePrefix="select"
					/>
				</div>
			</div>
		</div>
	);
}
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Select from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import { CLASS_TYPES, getUnits } from '../../services/lessonService';

export default function ClassFilters({ filters, onFilterChange }) {
	const { isDark } = useTheme();
	const [unitOptions, setUnitOptions] = useState([]);
	const stylesSelect = isDark ? selectStylesDark : selectStyles;

	useEffect(() => {
		const fetchUnits = async () => {
			try {
				const units = await getUnits();
				setUnitOptions(units);
			} catch (error) {
				console.error('Erro ao buscar unidades:', error);
			}
		};

		fetchUnits();
	}, []);

	const handleSearchChange = (e) => {
		onFilterChange({
			...filters,
			search: e.target.value
		});
	};

	const handleTypesChange = (selectedOptions) => {
		onFilterChange({
			...filters,
			types: selectedOptions || []
		});
	};

	const handleUnitsChange = (selectedOptions) => {
		onFilterChange({
			...filters,
			units: selectedOptions || []
		});
	};

	return (
		<div className="flex flex-col md:flex-row gap-4">
			<div className="flex-1">
				<div className="relative">
					<input
						type="text"
						placeholder="Buscar aulas..."
						value={filters.search}
						onChange={handleSearchChange}
						className="input-field pl-10 w-full"
					/>
					<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
				</div>
			</div>
			<div className="w-full md:w-64">
				<Select
					value={filters.types}
					onChange={handleTypesChange}
					options={CLASS_TYPES}
					placeholder="Tipos"
					isMulti
					styles={stylesSelect}
					className="react-select-container"
					classNamePrefix="react-select"
				/>
			</div>
			<div className="w-full md:w-64">
				<Select
					value={filters.units}
					onChange={handleUnitsChange}
					options={unitOptions}
					placeholder="Unidades"
					isMulti
					styles={stylesSelect}
					className="react-select-container"
					classNamePrefix="react-select"
				/>
			</div>
		</div>
	);
}
import Select from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';
import { PROVIDERS, CLASSIFICATIONS } from '../../services/trainingService';
import { selectStyles } from '../shared/selectStyles';
import { selectStylesDark } from '../shared/selectStylesDark';

const providerOptions = PROVIDERS.map(provider => ({
	value: provider,
	label: provider
}));

const classificationOptions = CLASSIFICATIONS.map(classification => ({
	value: classification,
	label: classification
}));

export default function TrainingFilters({ filters, onFilterChange }) {
	const { isDark } = useTheme();
	const stylesSelect = isDark ? selectStylesDark : selectStyles;

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
						placeholder="Buscar treinamentos..."
						className="input-field"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Fornecedores
					</label>
					<Select
						isMulti
						options={providerOptions}
						value={filters.providers}
						onChange={(selected) => onFilterChange({ ...filters, providers: selected })}
						styles={stylesSelect}
						menuPortalTarget={document.body}
						menuPosition={'fixed'}
						placeholder="Selecione os fornecedores"
						classNamePrefix="select"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Classificações
					</label>
					<Select
						isMulti
						options={classificationOptions}
						value={filters.classifications}
						onChange={(selected) => onFilterChange({ ...filters, classifications: selected })}
						styles={stylesSelect}
						menuPortalTarget={document.body}
						menuPosition={'fixed'}
						placeholder="Selecione as classificações"
						classNamePrefix="select"
					/>
				</div>
			</div>
		</div>
	);
}
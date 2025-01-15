import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';
import { getTrainingProviders, getTrainingClassifications } from '../../services/trainingService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import { showToast } from '../General/toast';

export default function TrainingFilters({ filters, onFilterChange, reloadKey = 0 }) {
	const { isDark } = useTheme();
	const stylesSelect = isDark ? selectStylesDark : selectStyles;
	const [isLoading, setIsLoading] = useState(true);
	const [providerOptions, setProviderOptions] = useState([]);
	const [classificationOptions, setClassificationOptions] = useState([]);

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				setIsLoading(true);
				const [providers, classifications] = await Promise.all([
					getTrainingProviders(),
					getTrainingClassifications()
				]);

				setProviderOptions(providers.map(provider => ({
					value: provider,
					label: provider
				})));
				setClassificationOptions(classifications.map(classification => ({
					value: classification,
					label: classification
				})));
			} catch (error) {
				showToast.error('Erro', 'Erro ao carregar opções de filtro');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOptions();
	}, [reloadKey]);

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
						isLoading={isLoading}
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
						isLoading={isLoading}
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
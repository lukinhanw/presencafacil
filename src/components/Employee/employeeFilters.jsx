import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';
import { getUnits, getPositions } from '../../services/employeeService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import { showToast } from '../General/toast';

export default function EmployeeFilters({ filters, onFilterChange }) {
    const { isDark } = useTheme();
    const stylesSelect = isDark ? selectStylesDark : selectStyles;
    const [unitOptions, setUnitOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [units, positions] = await Promise.all([
                    getUnits(),
                    getPositions()
                ]);

                setUnitOptions(units.map(unit => ({
                    value: unit,
                    label: unit
                })));

                setPositionOptions(positions.map(position => ({
                    value: position,
                    label: position
                })));
            } catch (error) {
                showToast.error('Erro', 'Não foi possível carregar os dados dos filtros');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

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
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Buscar por nome ou matrícula..."
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unidade
                    </label>
                    <Select
                        value={filters.unit}
                        onChange={(selected) => handleFilterChange('unit', selected)}
                        options={unitOptions}
                        styles={stylesSelect}
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        placeholder="Selecione a unidade"
                        classNamePrefix="select"
                        isClearable
                        isLoading={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cargo
                    </label>
                    <Select
                        value={filters.position}
                        onChange={(selected) => handleFilterChange('position', selected)}
                        options={positionOptions}
                        styles={stylesSelect}
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        placeholder="Selecione o cargo"
                        classNamePrefix="select"
                        isClearable
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
import Select from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';
import { UNITS, POSITIONS } from '../../services/employeeService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';

const unitOptions = UNITS.map(unit => ({
  value: unit,
  label: unit
}));

const positionOptions = POSITIONS.map(position => ({
  value: position,
  label: position
}));

export default function EmployeeFilters({ filters, onFilterChange }) {
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
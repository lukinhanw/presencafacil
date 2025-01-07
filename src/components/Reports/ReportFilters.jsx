import { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from '../../contexts/ThemeContext';
import { selectStyles } from '../../components/Shared/selectStyles';
import { selectStylesDark } from '../../components/Shared/selectStylesDark';
import { UNITS } from '../../utils/constants';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

const datePickerClassName = "input-field w-full text-gray-700 dark:text-gray-300 dark:bg-gray-800";

export default function ReportFilters({ type, onFilter, onGenerate, isLoading }) {
    const { isDark } = useTheme();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectedUnit, setSelectedUnit] = useState(null);

    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const handleFilter = () => {
        onFilter({
            startDate,
            endDate,
            unit: selectedUnit?.value,
        });
    };

    const unitOptions = UNITS.map(unit => ({ value: unit, label: unit }));

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Período
                    </label>
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                            handleFilter();
                        }}
                        className={datePickerClassName}
                        placeholderText="Selecione o período"
                        dateFormat="dd/MM/yyyy"
                        locale="pt-BR"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unidade
                    </label>
                    <Select
                        options={unitOptions}
                        value={selectedUnit}
                        onChange={(option) => {
                            setSelectedUnit(option);
                            handleFilter();
                        }}
                        styles={stylesSelect}
                        placeholder="Selecione a unidade"
                        isClearable
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="btn-gradient"
                >
                    {isLoading ? 'Gerando...' : 'Gerar Relatório'}
                </button>
            </div>
        </div>
    );
}
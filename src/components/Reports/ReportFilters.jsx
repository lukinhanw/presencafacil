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
import { DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/react/24/outline';

registerLocale('pt-BR', ptBR);
setDefaultLocale('pt-BR');

const unitOptions = UNITS.map(unit => ({
    value: unit,
    label: unit
}));

// Estilo personalizado para o DatePicker
const customDatePickerStyle = `
    .react-datepicker-wrapper {
        width: 100%;
    }
    .react-datepicker__input-container {
        width: 100%;
    }
`;

export default function ReportFilters({ type, onFilter, onGenerate, isLoading }) {
    const { isDark } = useTheme();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [selectedUnit, setSelectedUnit] = useState(null);

    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const filters = {
        startDate,
        endDate,
        unit: selectedUnit?.value,
    };

    const handleFilter = () => {
        onFilter(filters);
    };

    const handleGenerate = (format) => {
        onGenerate({ ...filters, format });
    };

    return (
        <>
            <style>{customDatePickerStyle}</style>
            <div className="glass-card p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Período
                        </label>
                        <div className="w-full">
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                    handleFilter();
                                }}
                                className="input-field w-full"
                                placeholderText="Selecione o período"
                                dateFormat="dd/MM/yyyy"
                                locale="pt-BR"
                                menuPortalTarget={document.body}
                                menuPosition={'fixed'}
                            />
                        </div>
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
                            menuPortalTarget={document.body}
                            menuPosition={'fixed'}
                            placeholder="Selecione a unidade"
                            classNamePrefix="select"
                            isClearable
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => handleGenerate('pdf')}
                            disabled={isLoading}
                            className="btn-gradient w-full flex items-center justify-center gap-2"
                            title="Exportar como PDF"
                        >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                            {isLoading ? 'Gerando...' : 'PDF'}
                        </button>
                        <button
                            onClick={() => handleGenerate('excel')}
                            disabled={isLoading}
                            className="btn-gradient-green w-full flex items-center justify-center gap-2"
                            title="Exportar como Excel"
                        >
                            <TableCellsIcon className="h-5 w-5" />
                            {isLoading ? 'Gerando...' : 'Excel'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
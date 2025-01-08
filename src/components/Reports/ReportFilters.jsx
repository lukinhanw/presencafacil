import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from '../../contexts/ThemeContext';
import { CLASS_TYPES } from '../../services/classService';
import { selectStyles } from '../../components/Shared/selectStyles';
import { selectStylesDark } from '../../components/Shared/selectStylesDark';

// Registrar o locale pt-BR
registerLocale('pt-BR', ptBR);

// Estilo personalizado para o DatePicker
const customDatePickerStyle = `
    .react-datepicker-wrapper {
        width: 100%;
    }
    .react-datepicker__input-container {
        width: 100%;
    }
    .react-datepicker__input-container input {
        width: 100%;
    }
`;

export default function ReportFilters({ type, onFilter, isLoading, classes }) {
    const { isDark } = useTheme();
    const [filters, setFilters] = useState({
        dateRange: [null, null],
        unit: null,
        instructor: null,
        classType: null,
        trainingCode: null,
        trainingName: null,
        provider: null
    });
    
    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    // Gerar opções únicas dos dados disponíveis
    const options = useMemo(() => {
        if (!classes) return {};

        const uniqueOptions = {
            trainingCodes: new Set(),
            trainingNames: new Set(),
            providers: new Set(),
            instructors: new Set(),
            units: new Set()
        };

        classes.forEach(cls => {
            uniqueOptions.trainingCodes.add(cls.training.code);
            uniqueOptions.trainingNames.add(cls.training.name);
            uniqueOptions.providers.add(cls.training.provider);
            uniqueOptions.instructors.add(JSON.stringify({
                value: cls.instructor.id,
                label: cls.instructor.name
            }));
            uniqueOptions.units.add(cls.unit);
        });

        return {
            trainingCodes: Array.from(uniqueOptions.trainingCodes)
                .map(code => ({ value: code, label: code })),
            trainingNames: Array.from(uniqueOptions.trainingNames)
                .map(name => ({ value: name, label: name })),
            providers: Array.from(uniqueOptions.providers)
                .map(provider => ({ value: provider, label: provider })),
            instructors: Array.from(uniqueOptions.instructors)
                .map(instructor => JSON.parse(instructor)),
            units: Array.from(uniqueOptions.units)
                .map(unit => ({ value: unit, label: unit }))
        };
    }, [classes]);

    useEffect(() => {
        handleFilterChange({ type: 'attendance_list' });
    }, []);

    const handleFilterChange = (newValues) => {
        const updatedFilters = {
            ...filters,
            ...newValues
        };
        setFilters(updatedFilters);

        onFilter({
            type: 'attendance_list',
            startDate: updatedFilters.dateRange[0],
            endDate: updatedFilters.dateRange[1],
            unit: updatedFilters.unit?.value,
            instructor: updatedFilters.instructor?.value,
            classType: updatedFilters.classType?.value,
            trainingCode: updatedFilters.trainingCode?.value,
            trainingName: updatedFilters.trainingName?.value,
            provider: updatedFilters.provider?.value
        });
    };
    
    return (
        <>
            <style>{customDatePickerStyle}</style>
            <div className="glass-card p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Período
                        </label>
                        <DatePicker
                            selectsRange={true}
                            startDate={filters.dateRange[0]}
                            endDate={filters.dateRange[1]}
                            onChange={(update) => handleFilterChange({ dateRange: update })}
                            className="input-field w-full"
                            placeholderText="Selecione o período"
                            dateFormat="dd/MM/yyyy"
                            locale="pt-BR"
                            monthsShown={2}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Código do Treinamento
                        </label>
                        <Select
                            value={filters.trainingCode}
                            onChange={(option) => handleFilterChange({ trainingCode: option })}
                            options={options.trainingCodes}
                            styles={stylesSelect}
                            placeholder="Selecione o código"
                            isClearable
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nome do Treinamento
                        </label>
                        <Select
                            value={filters.trainingName}
                            onChange={(option) => handleFilterChange({ trainingName: option })}
                            options={options.trainingNames}
                            styles={stylesSelect}
                            placeholder="Selecione o treinamento"
                            isClearable
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tipo do Treinamento
                        </label>
                        <Select
                            value={filters.classType}
                            onChange={(option) => handleFilterChange({ classType: option })}
                            options={CLASS_TYPES}
                            styles={stylesSelect}
                            placeholder="Selecione o tipo"
                            isClearable
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Fornecedor
                        </label>
                        <Select
                            value={filters.provider}
                            onChange={(option) => handleFilterChange({ provider: option })}
                            options={options.providers}
                            styles={stylesSelect}
                            placeholder="Selecione o fornecedor"
                            isClearable
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Unidade
                        </label>
                        <Select
                            value={filters.unit}
                            onChange={(option) => handleFilterChange({ unit: option })}
                            options={options.units}
                            styles={stylesSelect}
                            placeholder="Selecione a unidade"
                            isClearable
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Instrutor
                        </label>
                        <Select
                            value={filters.instructor}
                            onChange={(option) => handleFilterChange({ instructor: option })}
                            options={options.instructors}
                            styles={stylesSelect}
                            placeholder="Selecione o instrutor"
                            isClearable
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
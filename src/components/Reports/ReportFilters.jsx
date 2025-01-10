import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from '../../contexts/ThemeContext';
import { CLASS_TYPES } from '../../services/classService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [filters, setFilters] = useState({
        dateRange: [null, null],
        unit: null,
        instructor: null,
        classType: null,
        trainingCode: null,
        trainingName: null,
        provider: null,
        employeeName: '',
        registration: ''
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
        handleFilterChange({ type });
    }, [type]);

    const handleFilterChange = (newValues) => {
        const updatedFilters = {
            ...filters,
            ...newValues
        };
        setFilters(updatedFilters);

        // Enviar apenas os filtros relevantes para cada tipo de relatório
        if (type === 'attendance_list') {
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
        } else if (type === 'employee_training') {
            onFilter({
                type: 'employee_training',
                employeeName: updatedFilters.employeeName,
                registration: updatedFilters.registration
            });
        }
    };
    
    return (
        <>
            <style>{customDatePickerStyle}</style>
            <div className="glass-card">
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full p-4 flex justify-between items-center text-gray-900 dark:text-white"
                >
                    <span className="font-medium">Filtros</span>
                    {isCollapsed ? (
                        <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                        <ChevronUpIcon className="h-5 w-5" />
                    )}
                </button>
                
                <div className={`p-4 pt-0 space-y-4 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {type === 'attendance_list' ? (
                            // Filtros para lista de presença
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Período
                                    </label>
                                    <DatePicker
                                        selectsRange
                                        startDate={filters.dateRange[0]}
                                        endDate={filters.dateRange[1]}
                                        onChange={(update) => handleFilterChange({ dateRange: update })}
                                        isClearable
                                        locale="pt-BR"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecione o período"
                                        className="input-field"
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
                                        classNamePrefix="select"
                                        menuPortalTarget={document.body}
                                        menuPosition={'fixed'}
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
                                        classNamePrefix="select"
                                        menuPortalTarget={document.body}
                                        menuPosition={'fixed'}
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
                                        classNamePrefix="select"
                                        menuPortalTarget={document.body}
                                        menuPosition={'fixed'}
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
                                        classNamePrefix="select"
                                        menuPortalTarget={document.body}
                                        menuPosition={'fixed'}
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
                                        classNamePrefix="select"
                                        menuPortalTarget={document.body}
                                        menuPosition={'fixed'}
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
                                        classNamePrefix="select"
                                        menuPortalTarget={document.body}
                                        menuPosition={'fixed'}
                                    />
                                </div>
                            </>
                        ) : type === 'employee_training' ? (
                            // Filtros para relatório de colaboradores
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nome do Colaborador
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Digite o nome"
                                        value={filters.employeeName}
                                        onChange={(e) => handleFilterChange({ employeeName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Matrícula
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Digite a matrícula"
                                        value={filters.registration}
                                        onChange={(e) => handleFilterChange({ registration: e.target.value })}
                                    />
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
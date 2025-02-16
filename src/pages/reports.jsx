import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTheme } from '../contexts/ThemeContext';
import { showToast } from '../components/General/toast';
import { REPORT_TYPES, getReports, downloadReport } from '../services/reportService';
import { selectStyles } from '../components/Shared/selectStyles';
import { selectStylesDark } from '../components/Shared/selectStylesDark';
import { DocumentChartBarIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ReportFilters from '../components/Reports/ReportFilters';
import ReportList from '../components/Reports/ReportList';
import { getClasses } from '../services/classService';
import Tooltip from '../components/General/Tooltip';

export default function Reports() {
    const { isDark } = useTheme();
    const [selectedType, setSelectedType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({});
    const [allClasses, setAllClasses] = useState([]);

    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const fetchReports = async (currentFilters) => {
        try {
            setIsLoading(true);
            const data = await getReports(currentFilters);
            setReports(data);
        } catch (error) {
            showToast.error('Erro', 'Erro ao carregar relatórios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTypeChange = async (option) => {
        setSelectedType(option);
        if (option) {
            const newFilters = { ...filters, type: option.value };
            setFilters(newFilters);
            await fetchReports(newFilters);
        } else {
            setReports([]);
        }
    };

    const handleFilterChange = async (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        await fetchReports(updatedFilters);
    };

    const handleGenerateReport = async (reportData) => {
        try {
            setIsLoading(true);
            const result = await downloadReport({
                type: selectedType.value,
                ...reportData
            });
            showToast.success('Sucesso', result.message);
        } catch (error) {
            showToast.error('Erro', 'Erro ao gerar relatório');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadAllClasses = async () => {
            try {
                const data = await getClasses({});
                setAllClasses(data);
            } catch (error) {
                console.error('Erro ao carregar classes:', error);
            }
        };
        loadAllClasses();
    }, []);

    const actions = (row) => (
        <div className="flex space-x-2">
            <Tooltip content="Baixar relatório">
                <button
                    onClick={() => handleDownload(row)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
            </Tooltip>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Relatórios
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-gradient flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Novo Relatório
                </button>
            </div>

            <div className="space-y-4">
                <div className='glass-card p-4 space-y-4'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Relatório
                    </label>
                    <div className="w-full md:w-full lg:w-1/2">
                        <Select
                            options={REPORT_TYPES}
                            value={selectedType}
                            onChange={handleTypeChange}
                            styles={stylesSelect}
                            placeholder="Selecione o tipo"
                            isClearable
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            menuPosition={'fixed'}
                        />
                    </div>
                </div>

                {selectedType && (
                    <ReportFilters
                        type={selectedType.value}
                        onFilter={handleFilterChange}
                        isLoading={isLoading}
                        classes={allClasses}
                    />
                )}

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : reports.length > 0 ? (
                    <ReportList
                        reports={reports}
                        onGenerate={handleGenerateReport}
                        isLoading={isLoading}
                    />
                ) : selectedType && (
                    <div className="flex flex-col items-center justify-center py-12 glass-card">
                        <DocumentChartBarIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Nenhum relatório encontrado
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 
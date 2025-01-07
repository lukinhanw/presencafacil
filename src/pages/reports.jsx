import { useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { useTheme } from '../contexts/ThemeContext';
import { showToast } from '../components/General/toast';
import { REPORT_TYPES, getReports, generateReport, downloadReport } from '../services/reportService';
import { selectStyles } from '../components/Shared/selectStyles';
import { selectStylesDark } from '../components/Shared/selectStylesDark';
import { DocumentChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ReportFilters from '../components/Reports/ReportFilters';
import ReportList from '../components/Reports/ReportList';

export default function Reports() {
    const { isDark } = useTheme();
    const [selectedType, setSelectedType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({});

    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const handleTypeChange = async (option) => {
        setSelectedType(option);
        try {
            setIsLoading(true);
            const data = await getReports({ type: option?.value });
            setReports(data);
        } catch (error) {
            showToast.error('Erro', 'Erro ao carregar relatórios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateReport = async (reportType, reportFilters) => {
        try {
            setIsLoading(true);
            const reportData = await generateReport(reportType, reportFilters);
            const dataWithFormat = {
                ...reportData,
                format: reportFilters.format
            };
            const result = await downloadReport(dataWithFormat);
            showToast.success('Sucesso', result.message);
        } catch (error) {
            showToast.error('Erro', 'Erro ao gerar relatório');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Relatórios
                </h1>
            </div>

            <div className="space-y-4">
                <div className='glass-card p-4 space-y-4'>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Relatório
                    </label>
                    <div className="w-full md:w-72">
                        <Select
                            options={REPORT_TYPES}
                            value={selectedType}
                            onChange={handleTypeChange}
                            styles={stylesSelect}
                            placeholder="Selecione o tipo"
                            isClearable
                        />
                    </div>
                </div>

                {selectedType && (
                    <ReportFilters
                        type={selectedType.value}
                        onFilter={setFilters}
                        onGenerate={(filters) => handleGenerateReport(selectedType.value, filters)}
                        isLoading={isLoading}
                    />
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="glass-card h-48 p-4">
                                <div className="h-6 bg-gray-300/30 rounded w-3/4 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-300/30 rounded"></div>
                                    <div className="h-4 bg-gray-300/30 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-300/30 rounded w-4/6"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reports.length === 0 && selectedType ? (
                <div className="flex flex-col items-center justify-center py-12 glass-card">
                    <DocumentChartBarIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Nenhum relatório encontrado
                    </p>
                </div>
            ) : (
                reports.length > 0 && (
                    <ReportList
                        reports={reports}
                        onGenerate={handleGenerateReport}
                        isLoading={isLoading}
                    />
                )
            )}

        </div>
    );
} 
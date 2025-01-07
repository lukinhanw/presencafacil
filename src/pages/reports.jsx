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
            const result = await downloadReport(reportData);
            showToast.success('Sucesso', result.message);
        } catch (error) {
            showToast.error('Erro', 'Erro ao gerar relatório');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <DocumentChartBarIcon className="h-8 w-8" />
                        Relatórios
                    </h1>
                </div>

                <div className="glass-card p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tipo de Relatório
                                </label>
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
                                onGenerate={() => handleGenerateReport(selectedType.value, filters)}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                </div>

                {reports.length > 0 && (
                    <ReportList
                        reports={reports}
                        onGenerate={handleGenerateReport}
                        isLoading={isLoading}
                    />
                )}
            </motion.div>
        </div>
    );
} 
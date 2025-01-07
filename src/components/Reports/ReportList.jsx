import { motion } from 'framer-motion';
import { DocumentChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ReportList({ reports, onGenerate, isLoading }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 space-y-4"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <DocumentChartBarIcon className="h-6 w-6 text-primary-500" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {report.title}
                            </h3>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Última geração: {formatDate(report.lastGenerated)}
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => onGenerate(report.type)}
                            disabled={isLoading}
                            className="btn-gradient"
                        >
                            {isLoading ? 'Gerando...' : 'Gerar'}
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
} 
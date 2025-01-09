import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentChartBarIcon, ClockIcon, TableCellsIcon, UserIcon, BuildingOfficeIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { formatDateTimeHourMin } from '../../utils/dateUtils';

export default function ReportList({ reports, onGenerate, isLoading }) {
    const [selectedClasses, setSelectedClasses] = useState([]);

    const handleSelectClass = (classData) => {
        if (selectedClasses.find(c => c.id === classData.id)) {
            setSelectedClasses(selectedClasses.filter(c => c.id !== classData.id));
        } else {
            setSelectedClasses([...selectedClasses, classData]);
        }
    };

    const handleGenerateSelected = (format) => {
        onGenerate({ selectedClasses, format });
    };

    const renderClassCard = (classData) => (
        <motion.div
            key={classData.id}
            className="glass-card p-6 space-y-4"
        >
            <div className="flex items-start justify-between">
                <input
                    type="checkbox"
                    checked={selectedClasses.some(c => c.id === classData.id)}
                    onChange={() => handleSelectClass(classData)}
                    className="h-5 w-5"
                />
                <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {classData.training?.name || 'Sem nome'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {classData.training?.code || 'Sem código'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{classData.instructor?.name || 'Não definido'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{classData.unit || 'Não definida'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{formatDateTimeHourMin(classData.date_start)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{classData.attendees?.length || 0} presentes</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onGenerate({ classData, format: 'pdf' })}
                    disabled={isLoading}
                    className="btn-gradient flex-1 flex items-center justify-center gap-2"
                >
                    <DocumentChartBarIcon className="h-5 w-5 text-white" />
                    {isLoading ? 'Gerando...' : 'PDF'}
                </button>
                <button
                    onClick={() => onGenerate({ classData, format: 'excel' })}
                    disabled={isLoading}
                    className="btn-gradient-green flex-1 flex items-center justify-center gap-2"
                >
                    <TableCellsIcon className="h-5 w-5 text-white" />
                    {isLoading ? 'Gerando...' : 'Excel'}
                </button>
            </div>
        </motion.div>
    );

    const renderReportCard = (report) => (
        <motion.div
            key={report.id}
            className="glass-card p-6 space-y-4"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-medium">
                        {report.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {report.description}
                    </p>
                </div>
            </div>

            <div className="text-sm space-y-1">
                <p>Última geração: {formatDateTimeHourMin(report.lastGenerated)}</p>
            </div>

            <button
                onClick={() => onGenerate({ reportId: report.id })}
                disabled={isLoading}
                className="btn-gradient w-full"
            >
                {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
        </motion.div>
    );

    return (
        <div className="space-y-4">
            {reports.length > 0 && (
                <div className="flex justify-end gap-2">
                    <div className="flex gap-2">
                        {selectedClasses.length > 0 ? (
                            <>
                                <button
                                    onClick={() => handleGenerateSelected('pdf')}
                                    disabled={isLoading}
                                    className="btn-gradient flex items-center gap-2"
                                >
                                    <DocumentChartBarIcon className="h-5 w-5 text-white" />
                                    {isLoading ? 'Gerando...' : `PDF (${selectedClasses.length})`}
                                </button>
                                <button
                                    onClick={() => handleGenerateSelected('excel')}
                                    disabled={isLoading}
                                    className="btn-gradient-green flex items-center gap-2"
                                >
                                    <TableCellsIcon className="h-5 w-5 text-white" />
                                    {isLoading ? 'Gerando...' : `Excel (${selectedClasses.length})`}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onGenerate({ allClasses: reports, format: 'pdf' })}
                                    disabled={isLoading}
                                    className="btn bg-zinc-50 dark:bg-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md px-4 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                                >
                                    <DocumentChartBarIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    {isLoading ? 'Gerando...' : `PDF (${reports.length})`}
                                </button>
                                <button
                                    onClick={() => onGenerate({ allClasses: reports, format: 'excel' })}
                                    disabled={isLoading}
                                    className="btn bg-zinc-50 dark:bg-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md px-4 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                                >
                                    <TableCellsIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    {isLoading ? 'Gerando...' : `Excel (${reports.length})`}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((item) => (
                    item.training ? renderClassCard(item) : renderReportCard(item)
                ))}
            </div>
        </div>
    );
} 
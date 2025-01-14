import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    DocumentChartBarIcon, 
    TableCellsIcon,
    UserIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    Squares2X2Icon,
    ListBulletIcon,
    UsersIcon 
} from '@heroicons/react/24/outline';
import { formatDateTimeHourMin } from '../../utils/dateUtils';

export default function ReportList({ reports, onGenerate, isLoading }) {
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'

    const handleSelectClass = (classData) => {
        if (selectedClasses.find(c => c.id === classData.id)) {
            setSelectedClasses(selectedClasses.filter(c => c.id !== classData.id));
        } else {
            setSelectedClasses([...selectedClasses, classData]);
        }
    };

    const handleSelectEmployee = (report) => {
        if (selectedEmployees.find(e => e.employee.id === report.employee.id)) {
            setSelectedEmployees(selectedEmployees.filter(e => e.employee.id !== report.employee.id));
        } else {
            setSelectedEmployees([...selectedEmployees, report]);
        }
    };

    const handleSelectAllEmployees = () => {
        if (selectedEmployees.length === reports.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees([...reports]);
        }
    };

    const handleGenerateSelected = (format) => {
        if (selectedClasses.length > 0) {
            onGenerate({ selectedClasses, format });
        } else if (selectedEmployees.length > 0) {
            onGenerate({ selectedEmployees, format: 'excel' });
        }
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
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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

    const renderEmployeeReport = (report) => (
        <motion.div
            key={report.employee.id}
            className="glass-card p-6 space-y-4"
        >
            <div className="flex items-start justify-between">
                <input
                    type="checkbox"
                    checked={selectedEmployees.some(e => e.employee.id === report.employee.id)}
                    onChange={() => handleSelectEmployee(report)}
                    className="h-5 w-5"
                />
                <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {report.employee.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Matrícula: {report.employee.registration}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{report.employee.position}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{report.employee.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                    <AcademicCapIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{report.trainings.length} treinamentos</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onGenerate({ employeeReport: report, format: 'excel' })}
                    disabled={isLoading}
                    className="btn-gradient-green flex-1 flex items-center justify-center gap-2"
                >
                    <TableCellsIcon className="h-5 w-5 text-white" />
                    {isLoading ? 'Gerando...' : 'Excel'}
                </button>
            </div>
        </motion.div>
    );

    const renderListItem = (item) => {
        if (item.training) {
            return (
                <div className="flex items-center w-full">
                    <input
                        type="checkbox"
                        checked={selectedClasses.some(c => c.id === item.id)}
                        onChange={() => handleSelectClass(item)}
                        className="h-4 w-4 mr-4"
                    />
                    <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                        <div className="col-span-2">
                            <h4 className="font-medium">{item.training?.name || 'Sem nome'}</h4>
                            <span className="text-xs text-gray-500">{item.training?.code || 'Sem código'}</span>
                        </div>
                        <div className="text-sm list-text flex items-center gap-1">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            {item.instructor?.name || 'Não definido'}
                        </div>
                        <div className="text-sm list-text flex items-center gap-1">
                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                            {item.unit || 'Não definida'}
                        </div>
                        <div className="text-sm list-text flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            {formatDateTimeHourMin(item.date_start)}
                        </div>
                        <div className="text-sm list-text flex items-center gap-1">
                            <UsersIcon className="h-4 w-4 text-gray-400" />
                            {item.attendees?.length || 0} presentes
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={() => onGenerate({ classData: item, format: 'pdf' })}
                            className="p-2 rounded-md btn-gradient"
                        >
                            <DocumentChartBarIcon className="h-5 w-5 text-white" />
                        </button>
                        <button
                            onClick={() => onGenerate({ classData: item, format: 'excel' })}
                            className="p-2 rounded-md btn-gradient-green"
                        >
                            <TableCellsIcon className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>
            );
        }

        if (item.employee) {
            return (
                <div className="flex items-center w-full">
                    <input
                        type="checkbox"
                        checked={selectedEmployees.some(e => e.employee.id === item.employee.id)}
                        onChange={() => handleSelectEmployee(item)}
                        className="h-4 w-4 mr-4"
                    />
                    <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                        <div className="col-span-1">
                            <h4 className="font-medium">{item.employee.name}</h4>
                            <span className="text-xs text-gray-500">Matrícula: {item.employee.registration}</span>
                        </div>
                        <div className="text-sm list-text flex items-center gap-1">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            {item.employee.position}
                        </div>
                        <div className="text-sm list-text flex items-center gap-1">
                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                            {item.employee.unit}
                        </div>
                        <div className="text-sm list-text flex items-center gap-1">
                            <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                            {item.trainings.length} treinamentos
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={() => onGenerate({ employeeReport: item, format: 'excel' })}
                            className="p-2 rounded-md btn-gradient-green"
                        >
                            <TableCellsIcon className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="space-y-4">
            {reports.length > 0 && (
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Visualização:
                        </span>
                        <button
                            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
                            title={viewMode === 'list' ? 'Visualização em Grid' : 'Visualização em Lista'}
                        >
                            {viewMode === 'list' ? (
                                <Squares2X2Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <ListBulletIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {reports[0].employee ? (
                            <>
                                {selectedEmployees.length > 0 && (
                                    <button
                                        onClick={() => handleGenerateSelected('excel')}
                                        disabled={isLoading}
                                        className="btn-gradient-green flex items-center gap-2"
                                    >
                                        <TableCellsIcon className="h-5 w-5 text-white" />
                                        {isLoading ? 'Gerando...' : `Excel (${selectedEmployees.length})`}
                                    </button>
                                )}
                                <button
                                    onClick={handleSelectAllEmployees}
                                    className="btn-gradient flex items-center gap-2 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                                >
                                    <CheckCircleIcon className="h-5 w-5 text-white" />
                                    <span className="text-white">
                                        {selectedEmployees.length === reports.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                                    </span>
                                </button>
                            </>
                        ) : reports[0].training && (
                            <div className="flex gap-2 ml-auto">
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
                                            className="btn-gradient-secondary flex items-center gap-2"
                                        >
                                            <DocumentChartBarIcon className="h-5 w-5" />
                                            {isLoading ? 'Gerando...' : `PDF (${reports.length})`}

                                        </button>
                                        <button
                                            onClick={() => onGenerate({ allClasses: reports, format: 'excel' })}
                                            disabled={isLoading}
                                            className="btn-gradient-secondary flex items-center gap-2"
                                        >
                                            <TableCellsIcon className="h-5 w-5" />
                                            {isLoading ? 'Gerando...' : `Excel (${reports.length})`}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={viewMode === 'list' ? 'space-y-1' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {reports.map((item) => {
                    return viewMode === 'list' ? (
                        <motion.div
                            key={item.id || item.employee?.id}
                            className="glass-card py-2 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderListItem(item)}
                        </motion.div>
                    ) : (
                        item.training ? renderClassCard(item) :
                        item.employee ? renderEmployeeReport(item) :
                        renderReportCard(item)
                    );
                })}
            </div>
        </div>
    );
} 
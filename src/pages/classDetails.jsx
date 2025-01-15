import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { getClassById } from '../services/classService';
import { showToast } from '../components/General/toast';
import ClassAttendees from '../components/Class/classAttendees';
import ClassActions from '../components/Class/classActions';
import { formatDateTime } from '../utils/dateUtils';

export default function ClassDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchClassData = async () => {
        try {
            const data = await getClassById(id);
            setClassData(data);
        } catch (error) {
            showToast(error.message, 'error');
            navigate('/aulas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Carregando...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-8"
        >
            {/* Cabeçalho */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/aulas')}
                    className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                >
                    <FiArrowLeft className="mr-2" />
                    Voltar para lista
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{classData.training.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Código: {classData.training.code}
                            </p>
                        </div>
                        <span className={`type-badge ${getTypeStyle(classData.type)}`}>
                            {classData.type}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Data de Início</p>
                            <p className="font-medium">{formatDateTime(classData.date_start)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Unidade</p>
                            <p className="font-medium">{classData.unit}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Instrutor</p>
                            <p className="font-medium">{classData.instructor?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <p className="font-medium">{classData.status === 'scheduled' ? 'Em Andamento' : 'Finalizada'}</p>
                        </div>
                    </div>

                    {classData.date_end && (
                        <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                            Aula finalizada em {formatDateTime(classData.date_end)}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid com participantes e ações */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna de participantes (2/3) */}
                <div className="lg:col-span-2">
                    <ClassAttendees classData={classData} onUpdate={fetchClassData} />
                </div>

                {/* Coluna de ações (1/3) */}
                <div>
                    <ClassActions classData={classData} onUpdate={fetchClassData} />
                </div>
            </div>
        </motion.div>
    );
}

// Função auxiliar para estilização
const getTypeStyle = (type) => {
    const styles = {
        'Portfólio': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20',
        'Externo': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
        'DDS': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20',
        'Outros': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20'
    };
    return styles[type] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/20';
}; 
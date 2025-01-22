import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { finishClass } from '../../services/classService';
import { showToast } from '../General/toast';
import Alert from '../General/alert';

export default function ClassActions({ classData, onUpdate }) {
    const [showFinishAlert, setShowFinishAlert] = useState(false);

    const handleFinishClass = async () => {
        try {
            await finishClass(classData.id);
            showToast('Aula finalizada com sucesso', 'success');
            onUpdate();
            setShowFinishAlert(false);
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="space-y-4">
            {/* Ações da aula */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Ações da Aula</h3>
                <div className="space-y-4">
                    {classData.status === 'scheduled' && (
                        <button
                            onClick={() => setShowFinishAlert(true)}
                            className="btn-success w-full flex items-center justify-center"
                        >
                            <FiCheck className="mr-2" />
                            Finalizar Aula
                        </button>
                    )}
                </div>
            </div>

            {/* Alerta de confirmação para finalizar aula */}
            <Alert
                isOpen={showFinishAlert}
                onClose={() => setShowFinishAlert(false)}
                onConfirm={handleFinishClass}
                title="Finalizar Aula"
                message="Tem certeza que deseja finalizar esta aula? Esta ação não pode ser desfeita."
                type="warning"
            />
        </div>
    );
} 
import { useState } from 'react';
import { FiCheck, FiLink, FiCopy } from 'react-icons/fi';
import { finishClass, generateInviteLink } from '../../services/classService';
import { showToast } from '../General/toast';
import Alert from '../General/alert';

export default function ClassActions({ classData, onUpdate }) {
    const [showFinishAlert, setShowFinishAlert] = useState(false);
    const [inviteLink, setInviteLink] = useState(null);

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

    const handleGenerateInvite = async () => {
        try {
            const url = await generateInviteLink(classData.id);
            setInviteLink(`${window.location.origin}${url}`);
            showToast.success('Link de convite gerado com sucesso', 'success');
        } catch (error) {
            showToast.error('Erro ao gerar link de convite');
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Link copiado para a área de transferência', 'success');
        } catch (error) {
            showToast('Erro ao copiar link', 'error');
        }
    };

    return (
        <div className="space-y-4">
            {/* Ações da aula */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Ações da Aula</h3>
                <div className="space-y-4">
                    {classData.status === 'scheduled' && (
                        <>
                            <button
                                onClick={() => setShowFinishAlert(true)}
                                className="btn-success w-full flex items-center justify-center"
                            >
                                <FiCheck className="mr-2" />
                                Finalizar Aula
                            </button>
                            <button
                                onClick={handleGenerateInvite}
                                className="btn-primary w-full flex items-center justify-center"
                            >
                                <FiLink className="mr-2" />
                                Gerar Link de Convite
                            </button>
                        </>
                    )}

                    {/* Link de convite */}
                    {inviteLink && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <input
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="input-field flex-1 mr-2"
                                />
                                <button
                                    onClick={() => copyToClipboard(inviteLink)}
                                    className="btn-secondary"
                                    title="Copiar link"
                                >
                                    <FiCopy />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Este link expira em 1 hora
                            </p>
                        </div>
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
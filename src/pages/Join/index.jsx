import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getClassById, validateInviteToken, registerAttendance } from '../../services/classService';
import { getEmployeeByRegistration } from '../../services/employeeService';
import WebcamCapture from '../ClassInstance/components/WebcamCapture';
import { showToast } from '../../components/Toast';

export default function Join() {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState('registration'); // registration, photo, success
    const [isLoading, setIsLoading] = useState(false);
    const [classData, setClassData] = useState(null);
    const [employee, setEmployee] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        validateToken();
    }, [id, token]);

    const validateToken = async () => {
        try {
            setIsLoading(true);
            const isValid = await validateInviteToken(id, token);
            // if (!isValid) {
            //     showToast.error('Erro', 'Link de convite inválido ou expirado');
            //     navigate('/');
            //     return;
            // }

            const data = await getClassById(id);
            if (data.date_end) {
                showToast.error('Erro', 'Esta aula já foi finalizada');
                navigate('/');
                return;
            }

            setClassData(data);
        } catch (error) {
            showToast.error('Erro', 'Não foi possível validar o link de convite');
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistrationSubmit = async (data) => {
        try {
            setIsLoading(true);
            const employeeData = await getEmployeeByRegistration(data.registration);
            setEmployee(employeeData);
            setStep('photo');
        } catch (error) {
            showToast.error('Erro', 'Matrícula não encontrada');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoCapture = async (photoData) => {
        try {
            setIsLoading(true);
            await registerAttendance(id, {
                id: employee.id,
                name: employee.name,
                registration: employee.registration,
                photo: photoData,
                type: 'Invite'
            });
            setStep('success');
            showToast.success('Sucesso', 'Presença registrada com sucesso!');
        } catch (error) {
            showToast.error('Erro', error.message || 'Não foi possível registrar a presença');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !classData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-6 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {classData.training.name}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Instrutor: {classData.instructor.name}
                    </p>
                </div>

                {step === 'registration' && (
                    <form onSubmit={handleSubmit(handleRegistrationSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Matrícula
                            </label>
                            <input
                                type="text"
                                {...register('registration', {
                                    required: 'Matrícula é obrigatória',
                                    pattern: {
                                        value: /^\d+$/,
                                        message: 'Matrícula deve conter apenas números'
                                    }
                                })}
                                className="input-field"
                                placeholder="Digite sua matrícula"
                            />
                            {errors.registration && (
                                <p className="mt-1 text-sm text-red-500">{errors.registration.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-gradient w-full"
                        >
                            {isLoading ? 'Verificando...' : 'Continuar'}
                        </button>
                    </form>
                )}

                {step === 'photo' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                {employee.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Matrícula: {employee.registration}
                            </p>
                        </div>

                        <WebcamCapture
                            onCapture={handlePhotoCapture}
                            onCancel={() => setStep('registration')}
                            isLoading={isLoading}
                        />
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-6">
                        <div className="flex items-center justify-center">
                            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                                <svg className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Presença Registrada!
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Sua presença foi registrada com sucesso.
                            </p>
                        </div>

                        <button
                            onClick={() => window.close()}
                            className="btn-gradient w-full"
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { validateInviteToken } from '../services/classService';
import { getEmployeeByRegistration } from '../services/employeeService';
import WebcamCapture from '../components/ClassInstance/WebcamCapture';
import { showToast } from '../components/General/toast';

export default function Join() {
	const { id, token } = useParams();
	const navigate = useNavigate();
	const [step, setStep] = useState('validating'); // validating, registration, photo, success
	const [isLoading, setIsLoading] = useState(true);
	const [classData, setClassData] = useState(null);
	const [employee, setEmployee] = useState(null);
	const { register, handleSubmit, formState: { errors } } = useForm();

	useEffect(() => {
		validateInviteAndLoadClass();
	}, [id, token]);

	const validateInviteAndLoadClass = async () => {
		try {
			setIsLoading(true);
			const response = await validateInviteToken(id, token);
			
			if (!response.valid) {
				showToast.error('Link de convite inválido ou expirado');
				navigate('/');
				return;
			}

			setClassData(response.classData);
			setStep('registration');
		} catch (error) {
			showToast.error('Não foi possível validar o link de convite');
			navigate('/');
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegistrationSubmit = async (data) => {
		try {
			setIsLoading(true);
			const employeeData = await getEmployeeByRegistration(data.registration);
			
			// Verificar se o funcionário já está inscrito na aula
			const response = await fetch(`${import.meta.env.VITE_API_URL}/classes/${id}/participants/${employeeData.registration}/check`);
			const participantData = await response.json();
			
			if (participantData.isRegistered) {
				showToast.error('Você já está inscrito nesta aula');
				return;
			}
			
			setEmployee(employeeData);
			setStep('photo');
		} catch (error) {
			console.error('Erro ao buscar funcionário:', error);
			showToast.error(error.message || 'Matrícula não encontrada');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePhotoCapture = async (photoData) => {
		try {
			setIsLoading(true);

			const requestData = {
				name: employee.name,
				registration: employee.registration,
				unit: employee.unit,
				position: employee.position,
				photo: photoData
			};

			const response = await fetch(`${import.meta.env.VITE_API_URL}/classes/${id}/invite/${token}/join`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData)
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message || responseData.error || 'Erro ao registrar presença');
			}

			setStep('success');
			showToast.success('Presença registrada com sucesso!');
		} catch (error) {
			console.error('Erro ao registrar presença:', error);
			showToast.error(error.message || 'Não foi possível registrar a presença');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading || step === 'validating') {
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
						{classData.name}
					</h1>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Instrutor: {classData.instructor.name}
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Unidade: {classData.unit}
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Data: {new Date(classData.date_start).toLocaleDateString()}
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
							Você já pode fechar esta janela
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
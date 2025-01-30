import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, HomeIcon, UserIcon, LightBulbIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import Lottie from 'lottie-react';
import welcomeAnimation from '../assets/animations/welcome.json';
import { updateUserPassword } from '../services/userService';
import { showToast } from '../components/General/toast';

const steps = [
	{
		id: 1,
		title: 'Boas-vindas',
		description: 'Seja bem-vindo',
		icon: HomeIcon
	},
	{
		id: 2,
		title: 'Funcionalidades',
		description: 'Conheça o sistema',
		icon: LightBulbIcon
	},
	{
		id: 3,
		title: 'Perfil',
		description: 'Complete seu perfil',
		icon: UserIcon
	},
	{
		id: 4,
		title: 'Senha',
		description: 'Altere sua senha',
		icon: KeyIcon
	},
	{
		id: 5,
		title: 'Concluído',
		description: 'Tudo pronto!',
		icon: CheckIcon
	}
];

export default function Welcome() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset
	} = useForm();

	const handleNext = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleFinish = () => {
		navigate('/');
	};

	const onSubmitPassword = async (data) => {
		try {
			setIsLoading(true);
			await updateUserPassword({
				currentPassword: user?.registration, // Usando a matrícula como senha atual
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword
			});
			showToast.success('Sucesso', 'Senha alterada com sucesso!');
			handleNext();
		} catch (error) {
			showToast.error('Erro', error.message || 'Erro ao alterar senha');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Progress Bar */}
				<div className="relative mb-12 px-8">
					<div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 ease-in-out"
							style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
						/>
					</div>
					<div className="absolute top-0 left-8 right-8 flex justify-between transform -translate-y-1/2">
						{steps.map((step) => (
							<div
								key={step.id}
								className={`flex flex-col items-center ${currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
									}`}
							>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= step.id
										? 'bg-white dark:bg-gray-800 border-primary-500 dark:border-primary-400'
										: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
										}`}
								>
									<step.icon className="w-5 h-5" />
								</div>
								<div className="absolute mt-14 text-center w-32 -ml-18">
									<p className="text-sm font-medium">{step.title}</p>
									<p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Content */}
				<div className="mt-24 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
					{currentStep === 1 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="text-center space-y-8"
						>
							<h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
								Bem-vindo ao PresençaFácil
							</h2>
							<p className="text-xl text-gray-600 dark:text-gray-300">
								Olá {user?.name}! 👋<br/>
								Estamos muito felizes em ter você aqui.
							</p>
							<div className="max-w-md mx-auto">
								<Lottie
									animationData={welcomeAnimation}
									loop={true}
									className="w-full h-64"
								/>
							</div>
							<p className="text-lg text-gray-600 dark:text-gray-300">
								Vamos conhecer um pouco mais sobre o sistema?
							</p>
						</motion.div>
					)}

					{currentStep === 2 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="text-center"
						>
							<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
								Principais Funcionalidades
							</h2>
							<p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
								Conheça as ferramentas que facilitarão seu dia a dia.
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">📝</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Lista de Presença Digital
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Registre presenças de forma rápida e segura com fotos e assinaturas digitais.
									</p>
								</div>
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">📚</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Gestão de Treinamentos
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Organize e acompanhe todos os treinamentos em um só lugar.
									</p>
								</div>
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">📊</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Relatórios Detalhados
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Gere relatórios completos de presença e participação.
									</p>
								</div>
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">💬</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Suporte Integrado
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Conte com nossa equipe de suporte sempre que precisar.
									</p>
								</div>
							</div>
						</motion.div>
					)}

					{currentStep === 3 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="space-y-6"
						>
							<div className="text-center">
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
									Complete seu Perfil
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
									Para uma melhor experiência, precisamos de algumas informações adicionais.
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">👤</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Dados Pessoais
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Mantenha seus dados atualizados para melhor comunicação.
									</p>
								</div>
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">🔐</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Segurança
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Configure sua senha e preferências de segurança.
									</p>
								</div>
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">⚙️</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Personalização
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Ajuste o sistema de acordo com suas preferências.
									</p>
								</div>
							</div>
						</motion.div>
					)}

					{currentStep === 4 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="max-w-md mx-auto space-y-6"
						>
							<div className="text-center">
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
									Altere sua Senha
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
									Por segurança, altere sua senha inicial para uma de sua preferência.
								</p>
							</div>

							<form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
										Nova Senha
									</label>
									<input
										type="password"
										{...register('newPassword', {
											required: 'Nova senha é obrigatória',
											minLength: {
												value: 6,
												message: 'A senha deve ter no mínimo 6 caracteres'
											}
										})}
										className="input-field mt-1 w-full"
										placeholder="Digite sua nova senha"
									/>
									{errors.newPassword && (
										<p className="mt-1 text-sm text-red-500">
											{errors.newPassword.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
										Confirme a Nova Senha
									</label>
									<input
										type="password"
										{...register('confirmPassword', {
											required: 'Confirmação de senha é obrigatória',
											validate: (value) => {
												const newPassword = watch('newPassword');
												return value === newPassword || 'As senhas não coincidem';
											}
										})}
										className="input-field mt-1 w-full"
										placeholder="Confirme sua nova senha"
									/>
									{errors.confirmPassword && (
										<p className="mt-1 text-sm text-red-500">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>

								<div className="flex justify-end">
									<button
										type="submit"
										disabled={isLoading}
										className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
									>
										{isLoading ? 'Alterando...' : 'Alterar Senha'}
									</button>
								</div>
							</form>
						</motion.div>
					)}

					{currentStep === 5 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="space-y-8 text-center"
						>
							<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
								Tudo Pronto!
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">✨</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Configuração Concluída
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Seu perfil está pronto para uso.
									</p>
								</div>
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">🎯</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Comece a Usar
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Explore todas as funcionalidades do sistema.
									</p>
								</div>
								<div className="glass-card p-6 space-y-3">
									<div className="text-3xl">🚀</div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Suporte Disponível
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Estamos aqui para ajudar quando precisar.
									</p>
								</div>
							</div>
							<p className="text-lg text-gray-600 dark:text-gray-300 mt-8">
								Você está pronto para começar a usar o sistema. Vamos lá?
							</p>
						</motion.div>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between mt-12">
						<button
							onClick={handleBack}
							className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${currentStep === 1
								? 'opacity-0 cursor-default'
								: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
								}`}
							disabled={currentStep === 1}
						>
							Voltar
						</button>
						{currentStep < steps.length ? (
							currentStep === 4 ? null : (
								<button
									onClick={handleNext}
									className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
								>
									Próximo
								</button>
							)
						) : (
							<button
								onClick={handleFinish}
								className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
							>
								Começar
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
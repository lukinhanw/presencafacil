import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import { showToast } from '../components/General/toast';
import { motion } from 'framer-motion';

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const { config } = useConfig();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			await login(formData);
			navigate('/');
		} catch (error) {
			showToast.error('Erro', error.message || 'Erro ao fazer login');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full space-y-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center"
				>
					{config.logo ? (
						<img
							src={config.logo}
							alt="Logo"
							className="h-24 w-24 mx-auto object-contain"
						/>
					) : (
						<div className="h-24 w-24 mx-auto bg-primary-500/10 rounded-lg flex items-center justify-center">
							<span className="text-primary-500 font-bold text-4xl">
								{config.titulo?.charAt(0) || 'L'}
							</span>
						</div>
					)}
					<h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
						{config.titulo || 'Lista Digital'}
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Faça login para acessar o sistema
					</p>
				</motion.div>

				<motion.form
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="mt-8 space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								className="input-field mt-1"
								placeholder="Digite seu email"
							/>
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Senha
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								className="input-field mt-1"
								placeholder="Digite sua senha"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="btn-gradient w-full"
					>
						{isLoading ? 'Entrando...' : 'Entrar'}
					</button>
				</motion.form>
			</div>
		</div>
	);
}
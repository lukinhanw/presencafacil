import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';

export default function Login() {
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await login(credentials);
			const destination = location.state?.from?.pathname || '/';
			navigate(destination);
		} catch (error) {
			showToast.error('Erro', error.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="glass-card p-8 w-full max-w-md space-y-8">
				<div>
					<h2 className="text-center text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
						Lista de Presença Digital
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
						Faça login para acessar o sistema
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Email
							</label>
							<input
								id="email"
								type="email"
								required
								value={credentials.email}
								onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
								className="input-field"
								placeholder="seu@email.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Senha
							</label>
							<input
								id="password"
								type="password"
								required
								value={credentials.password}
								onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
								className="input-field"
								placeholder="••••••"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="btn-gradient w-full flex justify-center"
					>
						{loading ? 'Carregando...' : 'Entrar'}
					</button>
				</form>
			</div>
		</div>
	);
}
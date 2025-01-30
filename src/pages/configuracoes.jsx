import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { showToast } from '../components/General/toast';
import { getConfiguracoes, salvarConfiguracoes } from '../services/configService';

const ConfigSection = ({ title, description, children, icon: Icon }) => (
	<div className="glass-card p-6 space-y-4">
		<div className="flex items-center space-x-3">
			<div className="p-2 rounded-lg bg-primary-500/10">
				<Icon className="h-6 w-6 text-primary-500" />
			</div>
			<div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					{title}
				</h3>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					{description}
				</p>
			</div>
		</div>
		<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
			{children}
		</div>
	</div>
);

export default function Configuracoes() {
	const [loading, setLoading] = useState(true);
	const [config, setConfig] = useState({
		titulo: 'Lista de Presença Digital',
		logo: null
	});

	const [previewLogo, setPreviewLogo] = useState(null);

	useEffect(() => {
		carregarConfiguracoes();
	}, []);

	const carregarConfiguracoes = async () => {
		try {
			const data = await getConfiguracoes();
			setConfig(data);
			if (data.logo) {
				setPreviewLogo(`${import.meta.env.VITE_API_URL}/uploads/${data.logo}`);
			}
		} catch (error) {
			showToast.error('Erro', error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleLogoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setConfig({ ...config, logo: file });
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewLogo(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			await salvarConfiguracoes(config);
			showToast.success('Sucesso', 'Configurações salvas com sucesso!');
		} catch (error) {
			showToast.error('Erro', error.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Configurações do Sistema
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Personalize as configurações gerais do sistema
				</p>
			</motion.div>

			<div className="grid gap-6 md:grid-cols-2">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
				>
					<ConfigSection
						title="Informações Básicas"
						description="Configure as informações principais do sistema"
						icon={Cog6ToothIcon}
					>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Título do Sistema
								</label>
								<input
									type="text"
									value={config.titulo}
									onChange={(e) => setConfig({ ...config, titulo: e.target.value })}
									className="input-field"
									placeholder="Digite o título do sistema"
								/>
							</div>
						</div>
					</ConfigSection>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
				>
					<ConfigSection
						title="Logo"
						description="Configure a logo do sistema"
						icon={PhotoIcon}
					>
						<div className="space-y-4">
							<div>
								<div className="mt-1 flex items-center space-x-4">
									<div className="flex-shrink-0">
										{previewLogo ? (
											<img
												src={previewLogo}
												alt="Logo Preview"
												className="h-16 w-16 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
											/>
										) : (
											<div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
												<PhotoIcon className="h-8 w-8 text-gray-400" />
											</div>
										)}
									</div>
									<div className="flex-1">
										<input
											type="file"
											onChange={handleLogoChange}
											accept="image/*"
											className="hidden"
											id="logo-upload"
										/>
										<label
											htmlFor="logo-upload"
											className="btn-secondary cursor-pointer inline-block"
										>
											Escolher arquivo
										</label>
									</div>
								</div>
							</div>
						</div>
					</ConfigSection>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="mt-8 flex justify-end"
			>
				<button
					onClick={handleSave}
					disabled={loading}
					className="btn-gradient"
				>
					{loading ? 'Salvando...' : 'Salvar Configurações'}
				</button>
			</motion.div>
		</div>
	);
} 
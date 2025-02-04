import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { showToast } from '../components/General/toast';
import { updateConfig } from '../services/configService';
import { useConfig } from '../contexts/ConfigContext';
import ConfigSection from '../components/Config/ConfigSection';

export default function Configuracoes() {
	const [isLoading, setIsLoading] = useState(false);
	const [titulo, setTitulo] = useState('');
	const [logo, setLogo] = useState(null);
	const [previewLogo, setPreviewLogo] = useState(null);
	const { config, updateConfigData } = useConfig();

	useEffect(() => {
		setTitulo(config.titulo);
		if (config.logo) {
			setLogo(config.logo);
			setPreviewLogo(config.logo);
		}
	}, [config]);

	const handleLogoChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewLogo(reader.result);
				setLogo(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const configToUpdate = {
				titulo
			};
			
			if (logo && logo.startsWith('data:image')) {
				configToUpdate.logo = logo;
			}

			const updatedConfig = await updateConfig(configToUpdate);
			updateConfigData(updatedConfig);
			showToast.success('Sucesso', 'Configurações atualizadas com sucesso!');
		} catch (error) {
			showToast.error('Erro', error.message || 'Erro ao atualizar configurações');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-6"
			>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Configurações
				</h1>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Gerencie as configurações gerais do sistema
				</p>
			</motion.div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 }}
					>
						<ConfigSection
							title="Informações Básicas"
							description="Configure as informações básicas do sistema"
							icon={PhotoIcon}
						>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
										Título do Sistema
									</label>
									<input
										type="text"
										value={titulo}
										onChange={(e) => setTitulo(e.target.value)}
										className="input-field mt-1"
										placeholder="Digite o título do sistema"
										required
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
					className="flex justify-end"
				>
					<button
						type="submit"
						disabled={isLoading}
						className="btn-gradient"
					>
						{isLoading ? 'Salvando...' : 'Salvar Configurações'}
					</button>
				</motion.div>
			</form>
		</div>
	);
} 
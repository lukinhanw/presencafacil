import { useForm, Controller } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import Select from 'react-select';
import { PROVIDERS, CLASSIFICATIONS } from '../../services/trainingService';
import { selectStyles } from '../shared/selectStyles';
import { selectStylesDark } from '../shared/selectStylesDark';
import { useTheme } from '../../contexts/ThemeContext';

const providerOptions = PROVIDERS.map(provider => ({
	value: provider,
	label: provider
}));

const classificationOptions = CLASSIFICATIONS.map(classification => ({
	value: classification,
	label: classification
}));

export default function TrainingForm({ onSubmit, initialData, isLoading }) {

	const { isDark } = useTheme();
	const stylesSelect = isDark ? selectStylesDark : selectStyles;

	const { register, handleSubmit, control, formState: { errors } } = useForm({
		defaultValues: initialData ? {
			...initialData,
			provider: { value: initialData.provider, label: initialData.provider },
			classification: { value: initialData.classification, label: initialData.classification }
		} : {}
	});

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			provider: data.provider.value,
			classification: data.classification.value
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
			{/* Name field - full width */}
			<div className="w-full">
				<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Nome do Treinamento
				</label>
				<input
					type="text"
					id="name"
					{...register('name', { required: 'Nome é obrigatório' })}
					className="input-field mt-1"
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>

			{/* Other fields - 2 columns */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Código
					</label>
					<input
						type="text"
						id="code"
						{...register('code', { required: 'Código é obrigatório' })}
						className="input-field mt-1"
					/>
					{errors.code && (
						<p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Duração (HH:mm)
					</label>
					<Controller
						name="duration"
						control={control}
						rules={{
							required: 'Duração é obrigatória',
							pattern: {
								value: /^([0-9]{2}):([0-9]{2})$/,
								message: 'Formato inválido. Use HH:mm'
							}
						}}
						render={({ field: { onChange, value } }) => (
							<IMaskInput
								mask="00:00"
								value={value || ''}
								unmask={false}
								onAccept={(value) => onChange(value)}
								className="input-field mt-1"
								placeholder="00:00"
							/>
						)}
					/>
					{errors.duration && (
						<p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Fornecedor
					</label>
					<Controller
						name="provider"
						control={control}
						rules={{ required: 'Fornecedor é obrigatório' }}
						render={({ field }) => (
							<Select
								{...field}
								options={providerOptions}
								styles={stylesSelect}
								placeholder="Selecione um fornecedor"
								className="mt-1"
								classNamePrefix="select"
							/>
						)}
					/>
					{errors.provider && (
						<p className="mt-1 text-sm text-red-500">{errors.provider.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="classification" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Classificação
					</label>
					<Controller
						name="classification"
						control={control}
						rules={{ required: 'Classificação é obrigatória' }}
						render={({ field }) => (
							<Select
								{...field}
								options={classificationOptions}
								styles={stylesSelect}
								placeholder="Selecione uma classificação"
								className="mt-1"
								classNamePrefix="select"
							/>
						)}
					/>
					{errors.classification && (
						<p className="mt-1 text-sm text-red-500">{errors.classification.message}</p>
					)}
				</div>
			</div>

			<div>
				<label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Conteúdo Programático
				</label>
				<textarea
					id="content"
					rows={4}
					{...register('content', { required: 'Conteúdo é obrigatório' })}
					className="input-field mt-1"
				/>
				{errors.content && (
					<p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="objective" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Objetivo
				</label>
				<textarea
					id="objective"
					rows={4}
					{...register('objective', { required: 'Objetivo é obrigatório' })}
					className="input-field mt-1"
				/>
				{errors.objective && (
					<p className="mt-1 text-sm text-red-500">{errors.objective.message}</p>
				)}
			</div>

			<div className="flex justify-end space-x-4">
				<button
					type="submit"
					disabled={isLoading}
					className="btn-gradient"
				>
					{isLoading ? 'Salvando...' : 'Salvar'}
				</button>
			</div>
		</form>
	);
}
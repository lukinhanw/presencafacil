import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import Select from 'react-select';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { UNITS } from '../../services/employeeService';
import { CLASS_TYPES } from '../../services/classService';
import { selectStyles } from '../shared/selectStyles';
import { selectStylesDark } from '../shared/selectStylesDark';

const unitOptions = UNITS.map(unit => ({
	value: unit,
	label: unit
}));

export default function ClassForm({
	onSubmit,
	initialData,
	isLoading,
	trainings,
	instructors
}) {
	const { isDark } = useTheme();
	const { user, hasRole } = useAuth();
	const stylesSelect = isDark ? selectStylesDark : selectStyles;

	const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
		defaultValues: {
			...initialData,
			date_start: new Date().toISOString(),
			presents: 0
		}
	});

	const selectedType = watch('type');

	// If user is an instructor, set the instructor field automatically
	useEffect(() => {
		if (!hasRole('ADMIN_ROLE') && user) {
			setValue('instructor', {
				value: user.id,
				label: user.name
			});
		}
	}, [hasRole, user, setValue]);

	const handleFormSubmit = (data) => {
		const formattedData = {
			...data,
			type: data.type.value,
			unit: data.unit.value,
			instructor: {
				id: data.instructor.value,
				name: data.instructor.label
			},
			date_start: new Date().toISOString(),
			presents: 0
		};

		if (data.type.value === 'Portfolio') {
			const selectedTraining = trainings.find(t => t.id === data.training.value);
			formattedData.training = selectedTraining;
		} else {
			formattedData.training = {
				name: data.name,
				code: getCodeByType(data.type.value),
				duration: data.type.value === 'DDS' ? '00:40' : data.duration,
				provider: data.provider.value,
				content: data.content,
				classification: data.classification.value,
				objective: data.objective
			};
		}

		onSubmit(formattedData);
	};

	const getCodeByType = (type) => {
		switch (type) {
			case 'External': return 'EXT';
			case 'DDS': return 'DDS';
			case 'Others': return 'OUTROS';
			default: return '';
		}
	};

	const renderFormFields = () => {
		if (!selectedType) return null;

		const type = selectedType.value;

		if (type === 'Portfolio') {
			return (
				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Treinamento
						</label>
						<Controller
							name="training"
							control={control}
							rules={{ required: 'Treinamento é obrigatório' }}
							render={({ field }) => (
								<Select
									{...field}
									options={trainings.map(t => ({ value: t.id, label: t.name }))}
									styles={stylesSelect}
									placeholder="Selecione um treinamento"
									className="mt-1"
									classNamePrefix="select"
								/>
							)}
						/>
						{errors.training && (
							<p className="mt-1 text-sm text-red-500">{errors.training.message}</p>
						)}
					</div>
					{/* Readonly fields */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Nome do Treinamento
						</label>
						<input
							type="text"
							value={trainings.find(t => t.id === watch('training')?.value)?.name || ''}
							readOnly
							className="input-field mt-1"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Código
						</label>
						<input
							type="text"
							value={trainings.find(t => t.id === watch('training')?.value)?.code || ''}
							readOnly
							className="input-field mt-1"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Duração
						</label>
						<input
							type="text"
							value={trainings.find(t => t.id === watch('training')?.value)?.duration || ''}
							readOnly
							className="input-field mt-1"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Fornecedor
						</label>
						<input
							type="text"
							value={trainings.find(t => t.id === watch('training')?.value)?.provider || ''}
							readOnly
							className="input-field mt-1"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Conteúdo Programático
						</label>
						<textarea
							value={trainings.find(t => t.id === watch('training')?.value)?.content || ''}
							readOnly
							className="input-field mt-1"
							rows={4}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Classificação
						</label>
						<input
							type="text"
							value={trainings.find(t => t.id === watch('training')?.value)?.classification || ''}
							readOnly
							className="input-field mt-1"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Objetivo
						</label>
						<textarea
							value={trainings.find(t => t.id === watch('training')?.value)?.objective || ''}
							readOnly
							className="input-field mt-1"
							rows={4}
						/>
					</div>
				</div>
			);
		}

		const commonFields = (
			<>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Nome do Treinamento
					</label>
					<input
						type="text"
						{...register('name', { required: 'Nome é obrigatório' })}
						className="input-field mt-1"
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Fornecedor
					</label>
					<input
						type="text"
						{...register('provider', { required: 'Fornecedor é obrigatório' })}
						className="input-field mt-1"
					/>
					{errors.provider && (
						<p className="mt-1 text-sm text-red-500">{errors.provider.message}</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Conteúdo Programático
					</label>
					<textarea
						{...register('content', { required: 'Conteúdo é obrigatório' })}
						rows={4}
						className="input-field mt-1"
					/>
					{errors.content && (
						<p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Classificação
					</label>
					<input
						type="text"
						{...register('classification', { required: 'Classificação é obrigatória' })}
						className="input-field mt-1"
					/>
					{errors.classification && (
						<p className="mt-1 text-sm text-red-500">{errors.classification.message}</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Objetivo
					</label>
					<textarea
						{...register('objective', { required: 'Objetivo é obrigatório' })}
						rows={4}
						className="input-field mt-1"
					/>
					{errors.objective && (
						<p className="mt-1 text-sm text-red-500">{errors.objective.message}</p>
					)}
				</div>
			</>
		);

		if (type === 'External') {
			return (
				<div className="space-y-6">
					{commonFields}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Código
						</label>
						<input
							type="text"
							value="EXT"
							readOnly
							className="input-field mt-1"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
				</div>
			);
		}

		if (type === 'DDS' || type === 'Others') {
			return (
				<div className="space-y-6">
					{commonFields}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Código
						</label>
						<input
							type="text"
							value={type === 'DDS' ? 'DDS' : 'OUTROS'}
							readOnly
							className="input-field mt-1"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Duração
						</label>
						<input
							type="text"
							value="00:40"
							readOnly
							className="input-field mt-1"
						/>
					</div>
				</div>
			);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="col-span-1">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Tipo
					</label>
					<Controller
						name="type"
						control={control}
						rules={{ required: 'Tipo é obrigatório' }}
						render={({ field }) => (
							<Select
								{...field}
								options={CLASS_TYPES}
								styles={stylesSelect}
								placeholder="Selecione o tipo"
								className="mt-1"
								classNamePrefix="select"
							/>
						)}
					/>
					{errors.type && (
						<p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
					)}
				</div>

				{hasRole('ADMIN_ROLE') && (
					<div className="col-span-1">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Instrutor
						</label>
						<Controller
							name="instructor"
							control={control}
							rules={{ required: 'Instrutor é obrigatório' }}
							render={({ field }) => (
								<Select
									{...field}
									options={instructors.map(i => ({ value: i.id, label: i.name }))}
									styles={stylesSelect}
									placeholder="Selecione um instrutor"
									className="mt-1"
									classNamePrefix="select"
									isDisabled={!hasRole('ADMIN_ROLE')}
								/>
							)}
						/>
						{errors.instructor && (
							<p className="mt-1 text-sm text-red-500">{errors.instructor.message}</p>
						)}
					</div>
				)}

				<div className="col-span-1">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Unidade
					</label>
					<Controller
						name="unit"
						control={control}
						rules={{ required: 'Unidade é obrigatória' }}
						render={({ field }) => (
							<Select
								{...field}
								options={unitOptions}
								styles={stylesSelect}
								placeholder="Selecione uma unidade"
								className="mt-1"
								classNamePrefix="select"
							/>
						)}
					/>
					{errors.unit && (
						<p className="mt-1 text-sm text-red-500">{errors.unit.message}</p>
					)}
				</div>
			</div>

			{renderFormFields()}

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
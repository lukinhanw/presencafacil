import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { UNITS, POSITIONS } from '../../services/employeeService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import { useTheme } from '../../contexts/ThemeContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useNFCReader } from '../../hooks/useNFCReader';
import { normalizeCardNumber } from '../../utils/nfcUtils';
import { showToast } from '../General/toast';

const unitOptions = UNITS.map(unit => ({
	value: unit,
	label: unit
}));

const positionOptions = POSITIONS.map(position => ({
	value: position,
	label: position
}));

export default function EmployeeForm({ onSubmit, initialData, isLoading }) {
	const { isDark } = useTheme();
	const stylesSelect = isDark ? selectStylesDark : selectStyles;

	const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
		defaultValues: initialData ? {
			...initialData,
			unit: { value: initialData.unit, label: initialData.unit },
			position: { value: initialData.position, label: initialData.position }
		} : {}
	});

	// Adiciona o hook do leitor NFC
	const { isReading, error, clearError } = useNFCReader({
		onCardRead: (cardNumber) => {
			const normalized = normalizeCardNumber(cardNumber);
			setValue('cardNumber', normalized);
			showToast.success('Cartão Detectado', 'Código do cartão capturado com sucesso!');
		},
		enabled: !isLoading
	});

	// Trata erros do leitor
	useEffect(() => {
		if (error) {
			showToast.error('Erro na Leitura', error);
			clearError();
		}
	}, [error, clearError]);

	const handleFormSubmit = (data) => {
		onSubmit({
			...data,
			unit: data.unit.value,
			position: data.position.value
		});
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label htmlFor="registration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Matrícula
					</label>
					<input
						type="text"
						id="registration"
						{...register('registration', {
							required: 'Matrícula é obrigatória',
							pattern: {
								value: /^\d+$/,
								message: 'Matrícula deve conter apenas números'
							}
						})}
						className="input-field mt-1"
					/>
					{errors.registration && (
						<p className="mt-1 text-sm text-red-500">{errors.registration.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Nome Completo
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

				<div>
					<label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
								menuPortalTarget={document.body}
								menuPosition={'fixed'}
							/>
						)}
					/>
					{errors.unit && (
						<p className="mt-1 text-sm text-red-500">{errors.unit.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Cargo
					</label>
					<Controller
						name="position"
						control={control}
						rules={{ required: 'Cargo é obrigatório' }}
						render={({ field }) => (
							<Select
								{...field}
								options={positionOptions}
								styles={stylesSelect}
								placeholder="Selecione um cargo"
								className="mt-1"
								menuPortalTarget={document.body}
								menuPosition={'fixed'}
								classNamePrefix="select"
							/>
						)}
					/>
					{errors.position && (
						<p className="mt-1 text-sm text-red-500">{errors.position.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Cartão NFC
					</label>
					<div className="mt-1 flex gap-2">
						<div className="relative flex-1">
							<input
								type="text"
								id="cardNumber"
								{...register('cardNumber', {
									pattern: {
										value: /^[a-zA-Z0-9]{14}$/,
										message: 'O cartão NFC deve ter 14 caracteres alfanuméricos'
									}
								})}
								placeholder="Aproxime o cartão ou digite o código"
								className={`input-field w-full ${
									isReading ? 'pr-8 ring-2 ring-primary-500 dark:ring-primary-400' : ''
								}`}
							/>
							{isReading && (
								<div className="absolute right-2 top-1/2 -translate-y-1/2">
									<div className="h-3 w-3 rounded-full bg-primary-500 dark:bg-primary-400 animate-pulse" />
								</div>
							)}
						</div>
						<button
							type="button"
							onClick={() => setValue('cardNumber', '')}
							className="btn-secondary px-3 text-gray-700 dark:text-gray-100"
							title="Limpar código do cartão"
						>
							<XMarkIcon className="h-5 w-5" />
						</button>
					</div>
					{errors.cardNumber && (
						<p className="mt-1 text-sm text-red-500">{errors.cardNumber.message}</p>
					)}
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isReading 
							? 'Lendo cartão...' 
							: 'Aproxime o cartão do leitor ou digite manualmente o código de 14 caracteres'}
					</p>
				</div>
			</div>

			<div className="flex justify-end space-x-4">
				<button
					type="submit"
					
					className="btn-gradient"
				>
					{isLoading ? 'Salvando...' : 'Salvar'}
				</button>
			</div>
		</form>
	);
}
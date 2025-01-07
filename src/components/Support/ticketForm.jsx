import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../services/supportService';
import { useTheme } from '../../contexts/ThemeContext';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';

export default function TicketForm({ onSubmit, isLoading }) {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
    const { isDark } = useTheme();
    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Título
                </label>
                <input
                    type="text"
                    {...register('title', { required: 'Título é obrigatório' })}
                    className="input-field mt-1"
                    placeholder="Descreva brevemente seu problema"
                />
                {errors.title && (
                    <span className="text-sm text-red-500">{errors.title.message}</span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoria
                </label>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Categoria é obrigatória' }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={TICKET_CATEGORIES}
                            styles={stylesSelect}
                            className="mt-1"
                            classNamePrefix="select"
                            placeholder="Selecione uma categoria"
                            isDisabled={isLoading}
                        />
                    )}
                />
                {errors.category && (
                    <span className="text-sm text-red-500">{errors.category.message}</span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descrição
                </label>
                <textarea
                    {...register('description', { 
                        required: 'Descrição é obrigatória',
                        minLength: { value: 20, message: 'Descreva com pelo menos 20 caracteres' }
                    })}
                    rows={4}
                    className="input-field mt-1"
                    placeholder="Descreva detalhadamente seu problema ou sugestão..."
                />
                {errors.description && (
                    <span className="text-sm text-red-500">{errors.description.message}</span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prioridade
                </label>
                <Controller
                    name="priority"
                    control={control}
                    rules={{ required: 'Prioridade é obrigatória' }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={TICKET_PRIORITIES}
                            styles={stylesSelect}
                            className="mt-1"
                            classNamePrefix="select"
                            placeholder="Selecione a prioridade"
                            isDisabled={isLoading}
                        />
                    )}
                />
                {errors.priority && (
                    <span className="text-sm text-red-500">{errors.priority.message}</span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Anexos (opcional)
                </label>
                <input
                    type="file"
                    multiple
                    {...register('attachments')}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    accept=".jpg,.jpeg,.png,.pdf"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Formas aceitos: JPG, PNG, PDF. Tamanho máximo: 5MB por arquivo
                </p>
            </div>

            <motion.button
                type="submit"
                className="btn-gradient w-full"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {isLoading ? 'Enviando...' : 'Enviar Ticket'}
            </motion.button>
        </form>
    );
} 
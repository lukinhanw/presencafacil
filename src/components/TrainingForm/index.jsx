import { useForm } from 'react-hook-form';
import { PROVIDERS, CLASSIFICATIONS } from '../../services/trainingService';

export default function TrainingForm({ onSubmit, initialData, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
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
          <input
            type="text"
            id="duration"
            {...register('duration', { 
              required: 'Duração é obrigatória',
              pattern: {
                value: /^([0-9]{2}):([0-9]{2})$/,
                message: 'Formato inválido. Use HH:mm'
              }
            })}
            className="input-field mt-1"
            placeholder="00:00"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fornecedor
          </label>
          <select
            id="provider"
            {...register('provider', { required: 'Fornecedor é obrigatório' })}
            className="input-field mt-1"
          >
            <option value="">Selecione um fornecedor</option>
            {PROVIDERS.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
          {errors.provider && (
            <p className="mt-1 text-sm text-red-500">{errors.provider.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="classification" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Classificação
          </label>
          <select
            id="classification"
            {...register('classification', { required: 'Classificação é obrigatória' })}
            className="input-field mt-1"
          >
            <option value="">Selecione uma classificação</option>
            {CLASSIFICATIONS.map(classification => (
              <option key={classification} value={classification}>{classification}</option>
            ))}
          </select>
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
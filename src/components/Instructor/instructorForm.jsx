import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { UNITS } from '../../services/employeeService';
import { INSTRUCTOR_POSITIONS } from '../../services/instructorService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';
import { useTheme } from '../../contexts/ThemeContext';

const unitOptions = UNITS.map(unit => ({
  value: unit,
  label: unit
}));

const positionOptions = INSTRUCTOR_POSITIONS.map(position => ({
  value: position,
  label: position
}));

export default function InstructorForm({ onSubmit, initialData, isLoading }) {
  const { isDark } = useTheme();
  const stylesSelect = isDark ? selectStylesDark : selectStyles;

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData ? {
      ...initialData,
      unit: { value: initialData.unit, label: initialData.unit },
      position: { value: initialData.position, label: initialData.position }
    } : {}
  });

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
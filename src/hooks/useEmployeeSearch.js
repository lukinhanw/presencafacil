import { useState, useCallback } from 'react';
import { searchEmployees } from '../services/employeeService';
import { showToast } from '../components/Toast';

export function useEmployeeSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const loadOptions = useCallback(async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      setOptions([]);
      return;
    }

    try {
      setIsLoading(true);
      const employees = await searchEmployees(inputValue);
      const formattedOptions = employees.map(emp => ({
        value: emp.id,
        label: `${emp.name} (${emp.registration})`,
        employee: emp
      }));
      setOptions(formattedOptions);
    } catch (error) {
      showToast.error('Erro', 'Não foi possível buscar os colaboradores');
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    options,
    loadOptions
  };
}
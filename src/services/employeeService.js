// Mock data for employees
const MOCK_EMPLOYEES = [
  {
    id: 1,
    registration: '12345',
    name: 'João Silva',
    unit: 'Matriz',
    position: 'Desenvolvedor Senior'
  },
  {
    id: 2,
    registration: '67890',
    name: 'Maria Santos',
    unit: 'Filial SP',
    position: 'Analista de RH'
  }
];

export const UNITS = [
  'Matriz',
  'Filial SP',
  'Filial RJ',
  'Filial MG',
  'Filial RS'
];

export const POSITIONS = [
  'Desenvolvedor Junior',
  'Desenvolvedor Pleno',
  'Desenvolvedor Senior',
  'Analista de RH',
  'Analista Financeiro',
  'Gerente de Projetos',
  'Coordenador',
  'Diretor'
];

export const getEmployees = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredEmployees = [...MOCK_EMPLOYEES];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredEmployees = filteredEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchLower) ||
      employee.registration.includes(filters.search)
    );
  }

  if (filters.units?.length > 0) {
    filteredEmployees = filteredEmployees.filter(employee =>
      filters.units.includes(employee.unit)
    );
  }

  if (filters.positions?.length > 0) {
    filteredEmployees = filteredEmployees.filter(employee =>
      filters.positions.includes(employee.position)
    );
  }
  
  return filteredEmployees;
};

export const createEmployee = async (employeeData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Validate registration uniqueness
  if (MOCK_EMPLOYEES.some(emp => emp.registration === employeeData.registration)) {
    throw new Error('Matrícula já cadastrada');
  }

  const newEmployee = {
    id: MOCK_EMPLOYEES.length + 1,
    ...employeeData
  };
  MOCK_EMPLOYEES.push(newEmployee);
  return newEmployee;
};

export const updateEmployee = async (id, employeeData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Colaborador não encontrado');
  
  // Validate registration uniqueness (excluding current employee)
  if (MOCK_EMPLOYEES.some(emp => 
    emp.registration === employeeData.registration && emp.id !== id
  )) {
    throw new Error('Matrícula já cadastrada');
  }
  
  MOCK_EMPLOYEES[index] = { ...MOCK_EMPLOYEES[index], ...employeeData };
  return MOCK_EMPLOYEES[index];
};

export const deleteEmployee = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Colaborador não encontrado');
  
  MOCK_EMPLOYEES.splice(index, 1);
};
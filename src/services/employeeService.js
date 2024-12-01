const MOCK_EMPLOYEES = [
	{
		id: 1,
		name: 'João Silva',
		registration: '001',
		department: 'TI',
		position: 'Desenvolvedor'
	},
	{
		id: 2,
		name: 'Maria Santos',
		registration: '002',
		department: 'RH',
		position: 'Analista'
	},
	{
		id: 3,
		name: 'Pedro Oliveira',
		registration: '003',
		department: 'Comercial',
		position: 'Vendedor'
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

export const searchEmployees = async (query) => {
	await new Promise(resolve => setTimeout(resolve, 500));

	if (!query) return [];

	const searchLower = query.toLowerCase();
	return MOCK_EMPLOYEES.filter(emp =>
		emp.name.toLowerCase().includes(searchLower) ||
		emp.registration.toLowerCase().includes(searchLower)
	);
};

export const getEmployeeById = async (id) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const employee = MOCK_EMPLOYEES.find(emp => emp.id === parseInt(id));
	if (!employee) throw new Error('Funcionário não encontrado');
	return employee;
};
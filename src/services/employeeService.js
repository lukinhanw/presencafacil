// Mock data for employees
const MOCK_EMPLOYEES = [
	{
		id: 1,
		name: 'João Silva',
		registration: '001',
		unit: 'Matriz',
		position: 'Desenvolvedor',
		cardNumber: '81722cf9182738',
		lastCardRead: null
	},
	{
		id: 2,
		name: 'Maria Santos',
		registration: '002',
		unit: 'Filial SP',
		position: 'Analista',
		cardNumber: '92831ab7463829',
		lastCardRead: null
	},
	{
		id: 3,
		name: 'Pedro Oliveira',
		registration: '003',
		unit: 'Filial RJ',
		position: 'Vendedor',
		cardNumber: '37281ef9182734',
		lastCardRead: null
	},
	{
		id: 4,
		name: 'Ana Beatriz',
		registration: '004',
		unit: 'Matriz',
		position: 'Gerente',
		cardNumber: '12345cd8901234',
		lastCardRead: null
	},
	{
		id: 5,
		name: 'Carlos Eduardo',
		registration: '005',
		unit: 'Filial SP',
		position: 'Coordenador',
		cardNumber: '56789ef0123456',
		lastCardRead: null
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

	if (MOCK_EMPLOYEES.some(emp => emp.registration === employeeData.registration)) {
		throw new Error('Matrícula já cadastrada');
	}

	if (employeeData.cardNumber && MOCK_EMPLOYEES.some(emp => emp.cardNumber === employeeData.cardNumber)) {
		throw new Error('Número do cartão já cadastrado');
	}

	const newEmployee = {
		id: MOCK_EMPLOYEES.length + 1,
		...employeeData,
		lastCardRead: null
	};
	MOCK_EMPLOYEES.push(newEmployee);
	return newEmployee;
};

export const updateEmployee = async (id, employeeData) => {
	await new Promise(resolve => setTimeout(resolve, 500));

	const index = MOCK_EMPLOYEES.findIndex(e => e.id === id);
	if (index === -1) throw new Error('Colaborador não encontrado');

	if (MOCK_EMPLOYEES.some(emp =>
		emp.registration === employeeData.registration && emp.id !== id
	)) {
		throw new Error('Matrícula já cadastrada');
	}

	if (employeeData.cardNumber && MOCK_EMPLOYEES.some(emp =>
		emp.cardNumber === employeeData.cardNumber && emp.id !== id
	)) {
		throw new Error('Número do cartão já cadastrado');
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
	await new Promise(resolve => setTimeout(resolve, 300));

	if (!query || query.length < 2) return [];

	const searchLower = query.toLowerCase();
	return MOCK_EMPLOYEES.filter(emp =>
		emp.name.toLowerCase().includes(searchLower) ||
		emp.registration.toLowerCase().includes(searchLower)
	).slice(0, 10);
};

export const getEmployeeById = async (id) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const employee = MOCK_EMPLOYEES.find(emp => emp.id === parseInt(id));
	if (!employee) throw new Error('Funcionário não encontrado');
	return employee;
};

export const getEmployeeByRegistration = async (registration) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const employee = MOCK_EMPLOYEES.find(emp => emp.registration === registration);
	if (!employee) throw new Error('Funcionário não encontrado');
	return employee;
};

export const getEmployeeByCardNumber = async (cardNumber) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const employee = MOCK_EMPLOYEES.find(emp => emp.cardNumber === cardNumber);
	if (!employee) throw new Error('Cartão não cadastrado');

	// Update last card read timestamp
	employee.lastCardRead = new Date().toISOString();

	return employee;
};
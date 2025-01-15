const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Constantes mantidas para os selects do formulário
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

// Função auxiliar para obter o token
const getAuthHeader = () => {
	const auth = JSON.parse(localStorage.getItem('@presenca:auth'));
	return {
		'Authorization': `Bearer ${auth?.token}`,
		'Content-Type': 'application/json'
	};
};

export const getEmployees = async (filters = {}) => {
	const queryParams = new URLSearchParams();
	
	if (filters.search) queryParams.append('search', filters.search);
	if (filters.unit) queryParams.append('unit', filters.unit);
	if (filters.position) queryParams.append('position', filters.position);
	if (filters.page) queryParams.append('page', filters.page);
	if (filters.limit) queryParams.append('limit', filters.limit);

	const response = await fetch(`${API_URL}/employees?${queryParams}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao buscar colaboradores');
	}

	return response.json();
};

export const createEmployee = async (employeeData) => {
	const response = await fetch(`${API_URL}/employees`, {
		method: 'POST',
		headers: getAuthHeader(),
		body: JSON.stringify(employeeData)
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao criar colaborador');
	}

	return response.json();
};

export const updateEmployee = async (id, employeeData) => {
	const response = await fetch(`${API_URL}/employees/${id}`, {
		method: 'PUT',
		headers: getAuthHeader(),
		body: JSON.stringify(employeeData)
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao atualizar colaborador');
	}

	return response.json();
};

export const deleteEmployee = async (id) => {
	const response = await fetch(`${API_URL}/employees/${id}`, {
		method: 'DELETE',
		headers: getAuthHeader()
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao excluir colaborador');
	}
};

export const getUnits = async () => {
	const response = await fetch(`${API_URL}/employees/units`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao buscar unidades');
	}

	return response.json();
};

export const searchEmployees = async (query) => {
	if (!query || query.length < 2) return [];

	const response = await fetch(`${API_URL}/employees?search=${query}&limit=10`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao buscar colaboradores');
	}

	const { data } = await response.json();
	return data.map(emp => ({
		value: emp.id,
		label: `${emp.name} (${emp.registration})`,
		employee: emp
	}));
};

export const getEmployeeByCardNumber = async (cardNumber) => {
	const response = await fetch(`${API_URL}/employees?search=${cardNumber}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Cartão não cadastrado');
	}

	const { data } = await response.json();
	const employee = data.find(emp => emp.cardNumber === cardNumber);
	
	if (!employee) {
		throw new Error('Cartão não cadastrado');
	}

	return employee;
};

export const getEmployeeByRegistration = async (registration) => {
	const response = await fetch(`${API_URL}/employees?search=${registration}`, {
		headers: getAuthHeader()
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Funcionário não encontrado');
	}

	const { data } = await response.json();
	const employee = data.find(emp => emp.registration === registration);
	
	if (!employee) {
		throw new Error('Funcionário não encontrado');
	}

	return employee;
};
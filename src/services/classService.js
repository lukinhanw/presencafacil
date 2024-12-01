// Mock data for classes
const MOCK_CLASSES = [
	{
		id: 1,
		type: 'Portfolio',
		date_start: '2021-08-02T14:00:00',
		date_end: '2021-08-02T18:00:00',
		presents: 10,
		status: 'Finalizado',
		training: {
			name: 'Desenvolvimento React',
			code: 'TR-001',
			duration: '40:00',
			provider: 'Udemy',
			content: 'Fundamentos do React, Hooks, Context API, Redux',
			classification: 'Tecnologia',
			objective: 'Capacitar desenvolvedores em React.js'
		},
		instructor: {
			id: 1,
			name: 'Carlos Oliveira'
		},
		unit: 'Matriz'
	},
	{
		id: 2,
		type: 'Portfolio',
		date_start: '2021-09-15T09:00:00',
		date_end: '',
		presents: 15,
		status: 'Em andamento',
		training: {
			name: 'Liderança e Gestão de Equipes',
			code: 'TR-002',
			duration: '16:00',
			provider: 'RH Treinamentos',
			content: 'Habilidades de liderança, comunicação efetiva, gestão de conflitos',
			classification: 'Comportamental',
			objective: 'Desenvolver habilidades de liderança'
		},
		instructor: {
			id: 2,
			name: 'Ana Silva'
		},
		unit: 'Filial SP'
	},
	{
		id: 3,
		type: 'DDS',
		date_start: '2021-10-01T13:00:00',
		date_end: '',
		presents: 25,
		status: 'Em andamento',
		training: {
			name: 'Excel Avançado',
			code: 'TR-003',
			duration: '20:00',
			provider: 'Microsoft',
			content: 'Fórmulas avançadas, Macros, VBA',
			classification: 'Ferramentas',
			objective: 'Aprofundar conhecimentos em Excel'
		},
		instructor: {
			id: 3,
			name: 'Roberto Santos'
		},
		unit: 'Virtual'
	},
	{
		id: 4,
		type: 'Others',
		date_start: '2021-11-10T08:00:00',
		date_end: '',
		presents: 20,
		status: 'Em andamento',
		training: {
			name: 'Segurança do Trabalho',
			code: 'TR-004',
			duration: '24:00',
			provider: 'SENAI',
			content: 'NRs, EPIs, Prevenção de acidentes',
			classification: 'Segurança',
			objective: 'Capacitar em normas de segurança'
		},
		instructor: {
			id: 4,
			name: 'Marina Costa'
		},
		unit: 'Filial RJ'
	},
	{
		id: 5,
		type: 'External',
		date_start: '2021-12-05T09:00:00',
		date_end: '',
		presents: 18,
		status: 'Em andamento',
		training: {
			name: 'Marketing Digital',
			code: 'TR-005',
			duration: '30:00',
			provider: 'Digital Academy',
			content: 'SEO, Redes Sociais, Analytics',
			classification: 'Marketing',
			objective: 'Desenvolver estratégias de marketing digital'
		},
		instructor: {
			id: 5,
			name: 'Paulo Mendes'
		},
		unit: 'Matriz'
	},
	{
		id: 6,
		type: 'External',
		date_start: '2022-01-15T14:00:00',
		date_end: '',
		presents: 30,
		status: 'Em andamento',
		training: {
			name: 'Design Thinking',
			code: 'TR-006',
			duration: '12:00',
			provider: 'Innovation Lab',
			content: 'Metodologias ágeis, Design Sprint, Prototipação',
			classification: 'Inovação',
			objective: 'Aplicar métodos de design thinking'
		},
		instructor: {
			id: 6,
			name: 'Lucia Ferreira'
		},
		unit: 'Virtual'
	}
];

export const CLASS_TYPES = [
	{ value: 'Portfolio', label: 'Portfólio' },
	{ value: 'External', label: 'Externos' },
	{ value: 'DDS', label: 'DDS' },
	{ value: 'Others', label: 'Outros' }
];

export const getClasses = async (filters = {}) => {
	await new Promise(resolve => setTimeout(resolve, 500));

	let filteredClasses = [...MOCK_CLASSES];

	if (filters.search) {
		const searchLower = filters.search.toLowerCase();
		filteredClasses = filteredClasses.filter(cls =>
			cls.training.name.toLowerCase().includes(searchLower) ||
			cls.training.code.toLowerCase().includes(searchLower) ||
			cls.instructor.name.toLowerCase().includes(searchLower)
		);
	}

	if (filters.types?.length > 0) {
		filteredClasses = filteredClasses.filter(cls =>
			filters.types.includes(cls.type)
		);
	}

	if (filters.units?.length > 0) {
		filteredClasses = filteredClasses.filter(cls =>
			filters.units.includes(cls.unit)
		);
	}

	return filteredClasses;
};

export const createClass = async (classData) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const newClass = {
		id: MOCK_CLASSES.length + 1,
		...classData
	};
	MOCK_CLASSES.push(newClass);
	return newClass;
};

export const updateClass = async (id, classData) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const index = MOCK_CLASSES.findIndex(c => c.id === id);
	if (index === -1) throw new Error('Aula não encontrada');

	MOCK_CLASSES[index] = { ...MOCK_CLASSES[index], ...classData };
	return MOCK_CLASSES[index];
};

export const deleteClass = async (id) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const index = MOCK_CLASSES.findIndex(c => c.id === id);
	if (index === -1) throw new Error('Aula não encontrada');

	MOCK_CLASSES.splice(index, 1);
};
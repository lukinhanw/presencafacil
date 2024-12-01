// Mock data for classes
const MOCK_CLASSES = [
	{
		id: 1,
		type: 'Portfolio',
		training: {
			id: 1,
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
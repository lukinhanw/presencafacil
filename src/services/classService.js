// Mock data for classes
const MOCK_CLASSES = [
	{
		id: 1,
		type: 'Portfolio',
		date_start: '2024-03-15T14:00:00',
		date_end: '2024-03-15T18:00:00',
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
		unit: 'Matriz',
		attendees: [
			{
				id: 101,
				name: 'João Silva',
				registration: 'REG-001',
				timestamp: '2021-08-02T14:05:00',
				early_leave: false,
				position: 'Desenvolvedor'
			},
			{
				id: 102,
				name: 'Maria Santos',
				registration: 'REG-002',
				timestamp: '2021-08-02T14:03:00',
				early_leave: true,
				early_leave_time: '2021-08-02T17:30:00',
				position: 'Analista'
			},
			{
				id: 103,
				name: 'Pedro Oliveira',
				registration: 'REG-003',
				timestamp: '2021-08-02T14:10:00',
				early_leave: false,
				position: 'Vendedor'
			}
		]
	},
	{
		id: 2,
		type: 'Portfolio',
		date_start: '2024-03-20T09:00:00',
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
		unit: 'Filial SP',
		attendees: [
			{
				id: 201,
				name: 'Ana Costa',
				registration: 'REG-004',
				timestamp: '2021-09-15T09:02:00',
				early_leave: false,
				position: 'Gerente'
			},
			{
				id: 202,
				name: 'Lucas Ferreira',
				registration: 'REG-005',
				timestamp: '2021-09-15T09:05:00',
				early_leave: false,
				position: 'Vendedor'
			}
		]
	},
	{
		id: 3,
		type: 'External',
		date_start: '2024-03-10T13:00:00',
		date_end: '2024-03-10T17:00:00',
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
		unit: 'Matriz',
		attendees: [
			{
				id: 101,
				name: 'João Silva',
				registration: 'REG-001',
				timestamp: '2021-08-02T14:05:00',
				early_leave: false,
				position: 'Desenvolvedor'
			},
			{
				id: 102,
				name: 'Maria Santos',
				registration: 'REG-002',
				timestamp: '2021-08-02T14:03:00',
				early_leave: true,
				early_leave_time: '2021-08-02T17:30:00',
				position: 'Analista'
			},
			{
				id: 103,
				name: 'Pedro Oliveira',
				registration: 'REG-003',
				timestamp: '2021-08-02T14:10:00',
				early_leave: false,
				position: 'Vendedor'
			}
		]
	}
];

// Mock tokens for invite links
const INVITE_TOKENS = new Map();

export const CLASS_TYPES = [
	{ value: 'Portfolio', label: 'Portfólio' },
	{ value: 'External', label: 'Externos' },
	{ value: 'DDS', label: 'DDS' },
	{ value: 'Others', label: 'Outros' }
];

export const getClasses = async (filters = {}) => {
	await new Promise(resolve => setTimeout(resolve, 500));

	let filteredClasses = [...MOCK_CLASSES];

	// Filtro por texto (busca em nome do treinamento, código ou instrutor)
	if (filters.search) {
		const searchLower = filters.search.toLowerCase();
		filteredClasses = filteredClasses.filter(cls =>
			cls.training.name.toLowerCase().includes(searchLower) ||
			cls.training.code.toLowerCase().includes(searchLower) ||
			cls.instructor.name.toLowerCase().includes(searchLower)
		);
	}

	// Filtro por tipos
	if (filters.types?.length > 0) {
		const typeValues = filters.types.map(t => t.value);
		filteredClasses = filteredClasses.filter(cls =>
			typeValues.includes(cls.type)
		);
	}

	// Filtro por unidades
	if (filters.units?.length > 0) {
		const unitValues = filters.units.map(u => u.value);
		filteredClasses = filteredClasses.filter(cls =>
			unitValues.includes(cls.unit)
		);
	}

	// Filtro por período
	if (filters.startDate || filters.endDate) {
		filteredClasses = filteredClasses.filter(cls => {
			const classDate = new Date(cls.date_start);
			
			// Remover o horário das datas para comparar apenas as datas
			const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate());
			
			if (filters.startDate) {
				const startDate = new Date(filters.startDate);
				const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
				if (classDateOnly < startDateOnly) return false;
			}
			
			if (filters.endDate) {
				const endDate = new Date(filters.endDate);
				const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
				if (classDateOnly > endDateOnly) return false;
			}
			
			return true;
		});
	}

	// Filtro por instrutor
	if (filters.instructor) {
		filteredClasses = filteredClasses.filter(cls =>
			cls.instructor.id === filters.instructor
		);
	}

	// Filtro por fornecedor
	if (filters.provider) {
		const providerLower = filters.provider.toLowerCase();
		filteredClasses = filteredClasses.filter(cls =>
			cls.training.provider.toLowerCase().includes(providerLower)
		);
	}

	return filteredClasses;
};

export const createClass = async (classData) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const newClass = {
		id: MOCK_CLASSES.length + 1,
		...classData,
		attendees: []
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

export const removeAttendee = async (classId, attendeeId) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const classIndex = MOCK_CLASSES.findIndex(c => c.id === parseInt(classId));
	if (classIndex === -1) throw new Error('Aula não encontrada');

	const classData = MOCK_CLASSES[classIndex];
	classData.attendees = classData.attendees.filter(a => a.id !== attendeeId);
	classData.presents = classData.attendees.length;

	return classData;
};

export const updateEarlyLeave = async (classId, attendeeId) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const classIndex = MOCK_CLASSES.findIndex(c => c.id === parseInt(classId));
	if (classIndex === -1) throw new Error('Aula não encontrada');

	const classData = MOCK_CLASSES[classIndex];
	const attendeeIndex = classData.attendees.findIndex(a => a.id === attendeeId);
	if (attendeeIndex === -1) throw new Error('Participante não encontrado');

	classData.attendees[attendeeIndex].early_leave = true;
	classData.attendees[attendeeIndex].early_leave_time = new Date().toISOString();

	return classData;
};

export const registerAttendance = async (classId, attendeeData) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const classIndex = MOCK_CLASSES.findIndex(c => c.id === parseInt(classId));
	if (classIndex === -1) throw new Error('Aula não encontrada');

	const classData = MOCK_CLASSES[classIndex];

	// Check if attendee already exists
	const existingAttendee = classData.attendees.find(a => a.id === attendeeData.id);
	if (existingAttendee) {
		throw new Error('Participante já registrado nesta aula');
	}

	// Add new attendee
	const newAttendee = {
		...attendeeData,
		timestamp: new Date().toISOString(),
		early_leave: false
	};

	classData.attendees.push(newAttendee);
	classData.presents = classData.attendees.length;

	return classData;
};

export const getClassById = async (id) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const classData = MOCK_CLASSES.find(c => c.id === parseInt(id));
	if (!classData) throw new Error('Aula não encontrada');
	return classData;
};

export const finishClass = async (id) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const classIndex = MOCK_CLASSES.findIndex(c => c.id === parseInt(id));
	if (classIndex === -1) throw new Error('Aula não encontrada');

	MOCK_CLASSES[classIndex] = {
		...MOCK_CLASSES[classIndex],
		date_end: new Date().toISOString(),
		status: 'Finalizado'
	};

	return MOCK_CLASSES[classIndex];
};

export const generateInviteLink = async (classId) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const classData = MOCK_CLASSES.find(c => c.id === parseInt(classId));
	if (!classData) throw new Error('Aula não encontrada');

	const token = Math.random().toString(36).substring(2, 15);
	INVITE_TOKENS.set(token, {
		classId: parseInt(classId),
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
	});

	return `${window.location.origin}/aulas/${classId}/join/${token}`;
};

export const validateInviteToken = async (classId, token) => {
	await new Promise(resolve => setTimeout(resolve, 500));

	const tokenData = INVITE_TOKENS.get(token);
	if (!tokenData) return false;

	if (tokenData.classId !== parseInt(classId)) return false;
	if (tokenData.expiresAt < new Date()) {
		INVITE_TOKENS.delete(token);
		return false;
	}

	return true;
};

export const registerAttendanceByCard = async (classId, cardId) => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const classIndex = MOCK_CLASSES.findIndex(c => c.id === parseInt(classId));
	if (classIndex === -1) throw new Error('Aula não encontrada');

	const classData = MOCK_CLASSES[classIndex];

	// Mock employee data based on card
	const mockEmployee = {
		id: Math.floor(Math.random() * 1000),
		name: `Funcionário ${cardId}`,
		registration: `REG-${cardId}`,
		cardId,
		type: 'NFC'
	};

	// Check if card already registered
	const existingAttendee = classData.attendees.find(a => a.cardId === cardId);
	if (existingAttendee) {
		throw new Error('Cartão já registrado nesta aula');
	}

	return registerAttendance(classId, mockEmployee);
};
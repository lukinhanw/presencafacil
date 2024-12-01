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

export const removeAttendee = async (classId, attendeeId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const classIndex = MOCK_CLASSES.findIndex(c => c.id === classId);
    if (classIndex === -1) throw new Error('Aula não encontrada');

    const classData = MOCK_CLASSES[classIndex];
    if (!classData.attendees) return;

    classData.attendees = classData.attendees.filter(a => a.id !== attendeeId);
    classData.presents = classData.attendees.length;
    
    return classData;
};

export const updateEarlyLeave = async (classId, attendeeId, earlyLeave) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const classIndex = MOCK_CLASSES.findIndex(c => c.id === classId);
    if (classIndex === -1) throw new Error('Aula não encontrada');

    const classData = MOCK_CLASSES[classIndex];
    if (!classData.attendees) return;

    const attendeeIndex = classData.attendees.findIndex(a => a.id === attendeeId);
    if (attendeeIndex === -1) throw new Error('Participante não encontrado');

    classData.attendees[attendeeIndex] = {
        ...classData.attendees[attendeeIndex],
        earlyLeave
    };

    return classData;
};

export const registerAttendance = async (classId, attendeeData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const classIndex = MOCK_CLASSES.findIndex(c => c.id === parseInt(classId));
    if (classIndex === -1) throw new Error('Aula não encontrada');

    const classData = MOCK_CLASSES[classIndex];
    if (!classData.attendees) {
        classData.attendees = [];
    }

    // Check if attendee already exists
    const existingAttendee = classData.attendees.find(a => a.id === attendeeData.id);
    if (existingAttendee) {
        throw new Error('Participante já registrado');
    }

    // Add new attendee
    classData.attendees.push({
        ...attendeeData,
        timestamp: new Date().toISOString()
    });
    
    // Update presents count
    classData.presents = classData.attendees.length;

    return classData;
};

export const getClassById = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const classData = MOCK_CLASSES.find(c => c.id === parseInt(id));
    if (!classData) throw new Error('Aula não encontrada');
    if (!classData.attendees) classData.attendees = [];
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

    // Generate a unique token for the invite link
    const token = Math.random().toString(36).substring(2, 15);
    
    // In a real application, you would save this token in the database
    // For mock purposes, we'll just return the token
    return {
        url: `${window.location.origin}/aulas/${classId}/join/${token}`,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    };
};

export const registerAttendanceByCard = async (classId, cardId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const classIndex = MOCK_CLASSES.findIndex(c => c.id === parseInt(classId));
    if (classIndex === -1) throw new Error('Aula não encontrada');

    const classData = MOCK_CLASSES[classIndex];
    if (!classData.attendees) {
        classData.attendees = [];
    }

    // In a real application, you would:
    // 1. Look up the employee by their card ID in the database
    // 2. Verify if the card is valid and active
    // 3. Get the employee details
    
    // For mock purposes, we'll create a mock employee
    const mockEmployee = {
        id: Math.floor(Math.random() * 1000),
        name: `Funcionário Cartão ${cardId}`,
        registration: `REG-${cardId}`,
        cardId
    };

    // Check if attendee already exists
    const existingAttendee = classData.attendees.find(a => a.cardId === cardId);
    if (existingAttendee) {
        throw new Error('Cartão já registrado nesta aula');
    }

    // Add new attendee
    classData.attendees.push({
        ...mockEmployee,
        timestamp: new Date().toISOString()
    });
    
    // Update presents count
    classData.presents = classData.attendees.length;

    return classData;
};
// Mock data for instructors
const MOCK_INSTRUCTORS = [
  {
    id: 1,
    registration: '54321',
    name: 'Carlos Oliveira',
    unit: 'Matriz',
    position: 'Instrutor Senior'
  },
  {
    id: 2,
    registration: '98765',
    name: 'Ana Beatriz',
    unit: 'Filial SP',
    position: 'Instrutor Pleno'
  }
];

export const INSTRUCTOR_POSITIONS = [
  'Instrutor Junior',
  'Instrutor Pleno',
  'Instrutor Senior',
  'Coordenador de Treinamentos'
];

export const getInstructors = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredInstructors = [...MOCK_INSTRUCTORS];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredInstructors = filteredInstructors.filter(instructor => 
      instructor.name.toLowerCase().includes(searchLower) ||
      instructor.registration.includes(filters.search)
    );
  }

  if (filters.units?.length > 0) {
    filteredInstructors = filteredInstructors.filter(instructor =>
      filters.units.includes(instructor.unit)
    );
  }

  if (filters.positions?.length > 0) {
    filteredInstructors = filteredInstructors.filter(instructor =>
      filters.positions.includes(instructor.position)
    );
  }
  
  return filteredInstructors;
};

export const createInstructor = async (instructorData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (MOCK_INSTRUCTORS.some(inst => inst.registration === instructorData.registration)) {
    throw new Error('Matrícula já cadastrada');
  }

  const newInstructor = {
    id: MOCK_INSTRUCTORS.length + 1,
    ...instructorData
  };
  MOCK_INSTRUCTORS.push(newInstructor);
  return newInstructor;
};

export const updateInstructor = async (id, instructorData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_INSTRUCTORS.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Instrutor não encontrado');
  
  if (MOCK_INSTRUCTORS.some(inst => 
    inst.registration === instructorData.registration && inst.id !== id
  )) {
    throw new Error('Matrícula já cadastrada');
  }
  
  MOCK_INSTRUCTORS[index] = { ...MOCK_INSTRUCTORS[index], ...instructorData };
  return MOCK_INSTRUCTORS[index];
};

export const deleteInstructor = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_INSTRUCTORS.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Instrutor não encontrado');
  
  MOCK_INSTRUCTORS.splice(index, 1);
};
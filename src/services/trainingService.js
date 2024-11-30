// Mock data for trainings
const MOCK_TRAININGS = [
  {
    id: 1,
    name: 'Desenvolvimento React',
    code: 'TR-001',
    duration: '40:00',
    provider: 'Udemy',
    content: 'Fundamentos do React, Hooks, Context API, Redux',
    classification: 'Tecnologia',
    objective: 'Capacitar desenvolvedores em React.js'
  },
  {
    id: 2,
    name: 'Gestão Ágil',
    code: 'TR-002',
    duration: '20:00',
    provider: 'Alura',
    content: 'Scrum, Kanban, Lean',
    classification: 'Metodologia',
    objective: 'Implementar metodologias ágeis'
  }
];

export const PROVIDERS = [
  'Udemy',
  'Alura',
  'Coursera',
  'Pluralsight',
  'LinkedIn Learning'
];

export const CLASSIFICATIONS = [
  'Tecnologia',
  'Metodologia',
  'Soft Skills',
  'Liderança',
  'Compliance'
];

export const getTrainings = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredTrainings = [...MOCK_TRAININGS];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredTrainings = filteredTrainings.filter(training => 
      training.name.toLowerCase().includes(searchLower) ||
      training.code.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredTrainings;
};

export const createTraining = async (trainingData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newTraining = {
    id: MOCK_TRAININGS.length + 1,
    ...trainingData
  };
  MOCK_TRAININGS.push(newTraining);
  return newTraining;
};

export const updateTraining = async (id, trainingData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_TRAININGS.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Treinamento não encontrado');
  
  MOCK_TRAININGS[index] = { ...MOCK_TRAININGS[index], ...trainingData };
  return MOCK_TRAININGS[index];
};

export const deleteTraining = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_TRAININGS.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Treinamento não encontrado');
  
  MOCK_TRAININGS.splice(index, 1);
};
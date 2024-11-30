// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Administrador',
    roles: ['ADMIN_ROLE']
  },
  {
    id: 2,
    email: 'instructor@example.com',
    password: 'instructor123',
    name: 'Instrutor',
    roles: ['INSTRUCTOR_ROLE']
  }
];

export const loginUser = async ({ email, password }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
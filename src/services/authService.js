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

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const REMEMBER_KEY = 'remember_me';

const generateToken = (user) => {
  // In a real app, this would be a JWT token
  return btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
  }));
};

const isTokenValid = (token) => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

export const loginUser = async ({ email, password, rememberMe }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  // Generate authentication token
  const token = generateToken(user);

  // Store authentication data
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
    localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
    localStorage.removeItem(REMEMBER_KEY);
  }

  return userWithoutPassword;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const getStoredAuth = () => {
  const remembered = localStorage.getItem(REMEMBER_KEY) === 'true';
  const storage = remembered ? localStorage : sessionStorage;
  
  const token = storage.getItem(TOKEN_KEY);
  if (!token || !isTokenValid(token)) {
    logout();
    return null;
  }

  const userData = storage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};
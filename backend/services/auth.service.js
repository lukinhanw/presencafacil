const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class AuthService {
  async login(email, password) {
    // Busca o usuário pelo email
    const user = await User.findOne({ 
      where: { email }
    });
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verifica a senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gera o token JWT
    const token = this.generateToken(user);

    // Remove a senha antes de retornar
    const userJson = user.toJSON();
    delete userJson.password;

    return {
      user: userJson,
      token
    };
  }

  generateToken(user) {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(
      { 
        id: user.id,
        email: user.email,
        roles: user.roles
      },
      secret,
      { expiresIn: '24h' }
    );
  }
}

module.exports = new AuthService(); 
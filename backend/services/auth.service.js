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
        const userData = user.toJSON();
        
        // Garante que roles seja um array
        const roles = Array.isArray(userData.roles) ? userData.roles : 
                     (typeof userData.roles === 'string' ? JSON.parse(userData.roles) : 
                     [userData.roles]).filter(Boolean)

        const token = jwt.sign(
            {
                id: userData.id,
                email: userData.email,
                roles: roles
            },
            secret,
            { expiresIn: '24h' }
        );

        return token;
    }
}

module.exports = new AuthService(); 
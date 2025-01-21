const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader);
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const parts = authHeader.split(' ');
        console.log('Parts:', parts);
        if (parts.length !== 2) {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        const [scheme, token] = parts;
        console.log('Scheme:', scheme);
        console.log('Token:', token);
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Decoded:', decoded);
        
        // Garante que roles seja um array
        decoded.roles = Array.isArray(decoded.roles) ? decoded.roles : 
                       (typeof decoded.roles === 'string' ? JSON.parse(decoded.roles) : 
                       [decoded.roles]).filter(Boolean);
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' });
        }
        return res.status(401).json({ message: 'Falha na autenticação' });
    }
};

const hasRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        // Garante que roles seja um array
        const userRoles = Array.isArray(req.user.roles) ? req.user.roles : 
                         (typeof req.user.roles === 'string' ? JSON.parse(req.user.roles) : 
                         [req.user.roles]).filter(Boolean);

        const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
        if (!hasRequiredRole) {
            return res.status(403).json({ message: 'Acesso não autorizado' });
        }

        next();
    };
};

module.exports = { verifyToken, hasRole }; 
const { ValidationError, UniqueConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Erros de validação do Sequelize
    if (err instanceof ValidationError) {
        return res.status(400).json({
            message: 'Erro de validação',
            errors: err.errors.map(error => error.message)
        });
    }

    // Erros de unicidade do Sequelize
    if (err instanceof UniqueConstraintError) {
        return res.status(400).json({
            message: 'Dados duplicados',
            error: `${err.errors[0].path} já está em uso`
        });
    }

    // Erros de autenticação
    if (err.message === 'Credenciais inválidas') {
        return res.status(401).json({
            message: err.message
        });
    }

    // Erro padrão
    res.status(500).json({
        message: 'Erro interno do servidor'
    });
};

module.exports = errorHandler; 
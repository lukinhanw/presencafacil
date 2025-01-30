const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Config = sequelize.define('Config', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Lista de Presença Digital',
        validate: {
            notNull: { msg: 'Título é obrigatório' },
            notEmpty: { msg: 'Título é obrigatório' }
        }
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'configs',
    underscored: true
});

module.exports = Config; 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Ticket = sequelize.define('ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'open',
        validate: {
            isIn: [['open', 'in-progress', 'closed']]
        }
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['low', 'medium', 'high']]
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['technical', 'doubt', 'error', 'suggestion']]
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'tickets',
    timestamps: true,
    underscored: true
});

// Relacionamentos
Ticket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Ticket; 
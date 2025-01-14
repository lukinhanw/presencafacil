const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Instructor = require('./instructor.model');

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('Portfolio', 'External', 'DDS', 'Others'),
        allowNull: false,
        validate: {
            notNull: { msg: 'Tipo é obrigatório' },
            isIn: {
                args: [['Portfolio', 'External', 'DDS', 'Others']],
                msg: 'Tipo inválido'
            }
        }
    },
    date_start: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: { msg: 'Data de início é obrigatória' }
        }
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: true
    },
    presents: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        defaultValue: 'scheduled'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Nome é obrigatório' },
            notEmpty: { msg: 'Nome é obrigatório' }
        }
    },
    code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING(10)
    },
    provider: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.TEXT
    },
    classification: {
        type: DataTypes.STRING(100)
    },
    objective: {
        type: DataTypes.TEXT
    },
    unit: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: { msg: 'Unidade é obrigatória' },
            notEmpty: { msg: 'Unidade é obrigatória' }
        }
    },
    instructor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Instrutor é obrigatório' }
        }
    }
}, {
    tableName: 'classes',
    underscored: true
});

// Relacionamento com Instrutor
Class.belongsTo(Instructor, {
    foreignKey: 'instructor_id',
    as: 'instructor'
});

module.exports = Class; 
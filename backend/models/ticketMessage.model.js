const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Ticket = require('./ticket.model');

const TicketMessage = sequelize.define('ticket_message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_support: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tickets',
            key: 'id'
        }
    },
    attachments: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const value = this.getDataValue('attachments');
            return value || [];
        }
    }
}, {
    tableName: 'ticket_messages',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relacionamentos
TicketMessage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
TicketMessage.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
Ticket.hasMany(TicketMessage, { foreignKey: 'ticket_id', as: 'messages' });

module.exports = TicketMessage; 
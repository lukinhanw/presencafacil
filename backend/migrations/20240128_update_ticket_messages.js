'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Adicionar coluna sender_type
        await queryInterface.addColumn('ticket_messages', 'sender_type', {
            type: Sequelize.ENUM('user', 'instructor'),
            allowNull: true // temporariamente true para migração
        });

        // Renomear coluna user_id para sender_id
        await queryInterface.renameColumn('ticket_messages', 'user_id', 'sender_id');

        // Atualizar registros existentes
        await queryInterface.sequelize.query(`
            UPDATE ticket_messages 
            SET sender_type = 'user' 
            WHERE sender_type IS NULL
        `);

        // Tornar sender_type not null
        await queryInterface.changeColumn('ticket_messages', 'sender_type', {
            type: Sequelize.ENUM('user', 'instructor'),
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Reverter as alterações
        await queryInterface.renameColumn('ticket_messages', 'sender_id', 'user_id');
        await queryInterface.removeColumn('ticket_messages', 'sender_type');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_ticket_messages_sender_type');
    }
}; 
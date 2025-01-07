// Mock do usuário atual
let MOCK_USER = {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    roles: ['ADMIN_ROLE'],
    registration: 'ADM001',
    position: 'Administrador do Sistema',
    unit: 'Matriz',
    avatar: null
};

export const updateUserProfile = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validações
    if (data.email && data.email !== MOCK_USER.email) {
        if (data.email === 'usado@example.com') {
            throw new Error('Este email já está em uso');
        }
    }

    // Atualiza os dados mockados
    MOCK_USER = {
        ...MOCK_USER,
        name: data.name,
        email: data.email,
        position: data.position,
        unit: data.unit,
        avatar: data.avatar
    };

    // Retorna os dados atualizados
    return MOCK_USER;
};

export const updateUserPassword = async (data) => {
    // Simula delay da rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simula validação de senha atual
    if (data.currentPassword !== 'senha123') {
        throw new Error('Senha atual incorreta');
    }

    // Simula validação de nova senha
    if (data.newPassword.length < 6) {
        throw new Error('A nova senha deve ter no mínimo 6 caracteres');
    }

    if (data.newPassword !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
    }

    // Em um cenário real, aqui atualizaríamos a senha no backend
    return { message: 'Senha atualizada com sucesso' };
}; 
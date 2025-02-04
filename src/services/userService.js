const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const auth = JSON.parse(localStorage.getItem('@presenca:auth'));
    if (!auth || !auth.token) {
        throw new Error('Usuário não autenticado');
    }
    return {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
    };
};

const handleErrorResponse = async (response) => {
    const data = await response.json();
    
    // Caso 1: Erros de validação do express-validator
    if (data.errors && Array.isArray(data.errors)) {
        throw new Error(data.errors.map(err => err.msg).join(', '));
    }
    
    // Caso 2: Erro específico com mensagem e error
    if (data.error) {
        throw new Error(data.error);
    }
    
    // Caso 3: Apenas mensagem de erro
    if (data.message) {
        throw new Error(data.message);
    }
    
    // Caso padrão
    throw new Error('Erro na operação');
};

export const updateUserProfile = async (data) => {
    try {
        // Primeiro atualiza os dados básicos
        const response = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                position: data.position,
                unit: data.unit
            })
        });

        if (!response.ok) {
            await handleErrorResponse(response);
        }

        const updatedData = await response.json();

        // Se houver avatar, faz uma chamada separada
        if (data.avatar && data.avatar.startsWith('data:image')) {
            const avatarResponse = await fetch(`${API_URL}/profile/avatar`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({ avatar: data.avatar })
            });

            if (!avatarResponse.ok) {
                await handleErrorResponse(avatarResponse);
            }

            const avatarData = await avatarResponse.json();
            return avatarData.data;
        }

        return updatedData.data;
    } catch (error) {
        throw new Error(error.message || 'Erro ao atualizar perfil');
    }
};

export const updateUserPassword = async (data) => {
    try {
        // Validação no frontend
        if (data.newPassword !== data.confirmPassword) {
            throw new Error('As senhas não coincidem');
        }

        const response = await fetch(`${API_URL}/profile/change-password`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })
        });

        if (!response.ok) {
            await handleErrorResponse(response);
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        throw new Error(error.message || 'Erro ao atualizar senha');
    }
};

export const getUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            await handleErrorResponse(response);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error(error.message || 'Erro ao buscar perfil');
    }
}; 
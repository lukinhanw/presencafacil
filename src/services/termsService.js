import { getStoredAuth } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const acceptTerms = async () => {
    try {
        const { token } = getStoredAuth();
        const response = await fetch(`${API_URL}/terms/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao aceitar os termos');
        }

        return await response.json();
    } catch (error) {
        throw error.message || 'Erro ao aceitar os termos';
    }
};

export const getTermsStatus = async () => {
    try {
        const { token } = getStoredAuth();
        const response = await fetch(`${API_URL}/terms/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao obter status dos termos');
        }

        return await response.json();
    } catch (error) {
        throw error.message || 'Erro ao obter status dos termos';
    }
}; 
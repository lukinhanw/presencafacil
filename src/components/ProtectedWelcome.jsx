import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedWelcome = ({ children }) => {
    const { user, isAuthenticated, initialized } = useAuth();

    // Não faz nada até que a autenticação esteja inicializada
    if (!initialized) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Se o usuário já aceitou os termos, redireciona para a página principal
    if (user?.terms === 1) {
        return <Navigate to="/" />;
    }

    // Se o usuário não aceitou os termos, mostra a página de boas-vindas
    return children;
}; 
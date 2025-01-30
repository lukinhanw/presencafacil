import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  // Não faz nada até que a autenticação esteja inicializada
  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (user?.terms === 0 && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" />;
  }

  if (roles && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
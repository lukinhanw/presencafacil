import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, roles }) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
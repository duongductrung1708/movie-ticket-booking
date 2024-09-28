import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

export const RedirectRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/home" replace /> : element;
};

export const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/signin" replace />;
};

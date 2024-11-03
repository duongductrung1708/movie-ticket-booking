import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

export const RedirectRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/home" replace /> : element;
};

export const ProtectedRoute = ({ element, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/404" replace />;
  }

  return element;
};

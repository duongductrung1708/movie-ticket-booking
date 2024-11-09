import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

export const RedirectRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/home" replace /> : element;
};

export const ProtectedRoute = ({ element, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to the sign-in page, preserving the intended destination state
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/404" replace />;
  }

  return element;
};

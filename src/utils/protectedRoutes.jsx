// ProtectedRoute.js

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation(); // Get the current location

  // If user is not logged in, redirect to login page with the intended path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, return the element (protected component)
  return <Outlet />;
};

export default ProtectedRoute;








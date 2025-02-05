import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const user = localStorage.getItem("user");
  
  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/permission-denied" replace />;
  }

  const userRole = JSON.parse(user).role;
  
  // Check if user has the required role
  if (userRole !== requiredRole) {
    // If user doesn't have required role, show permission denied
    return <Navigate to="/permission-denied" replace />;
  }

  // If user has correct role, render the children (protected route content)
  return children;
};

export default ProtectedRoute;
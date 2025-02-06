import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  
  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/permission-denied" replace />;
  }

  const userRole = JSON.parse(user).role;
  

  // If user has correct role, render the children (protected route content)
  return children;
};

export default ProtectedRoute;
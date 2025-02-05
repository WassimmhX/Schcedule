import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>{localStorage.getItem('user') }</h1>
    </div>
  );
};

export default Dashboard;

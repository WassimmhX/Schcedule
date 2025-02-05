import { Navigate } from "react-router-dom";

const Dashboard = () => {

  

  return (
    <div>
      <h1>Home</h1>
      <h1>{localStorage.getItem('user') }</h1>
    </div>
  );
};

export default Dashboard;

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : "guest";

  const navigate = useNavigate();

  const handleLogOut = () => {
    navigate(0);
    logout();
  }
  
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">ISIMM Planning</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        { role==='admin'? <Link to="/schedule" className="hover:underline">Shcedule</Link> : <></>}
        <Link to="/planning" className="hover:underline">Planning</Link>
        <Link to="/Test" className="hover:underline">Test</Link>
        <Link to="/schedulesTable" className="hover:underline">schedulesTable</Link>
        {user ? <button onClick={handleLogOut} className="text-black font-semibold hover:underline">LogOut</button> 
                    :<Link to="/login" className="hover:underline">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;

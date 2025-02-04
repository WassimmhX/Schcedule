import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const { isLoggedIn } = useAuth();
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">ISIMM Planning</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/planning" className="hover:underline">Planning</Link>
        <Link to="/Schedule" className="hover:underline">Schedule</Link>
        <Link to="/Test" className="hover:underline">Test</Link>
        {isLoggedIn ?<button onClick={()=>logout()} className="text-black font-semibold hover:underline">LogOut</button> 
                    :<Link to="/login" className="hover:underline">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;

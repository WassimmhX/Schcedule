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
<<<<<<< HEAD
        <Link to="/Schcedule" className="hover:underline">Schcedule</Link>
=======
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/Schedule" className="hover:underline">Schcedule</Link>
>>>>>>> fc0b5ddead01a53e858180e771881341a454ba8d
        <Link to="/Test" className="hover:underline">Test</Link>
        {isLoggedIn ?<button onClick={()=>logout()} className="text-black font-semibold hover:underline">LogOut</button> 
                    :<Link to="/login" className="hover:underline">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;

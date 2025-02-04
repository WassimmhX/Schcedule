import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">ISIMM Planning</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/planning" className="hover:underline">Planning</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/Schcedule" className="hover:underline">Schcedule</Link>
        <Link to="/Test" className="hover:underline">Test</Link>
      </div>
    </nav>
  );
};

export default Navbar;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Schedule from "./components/Schedule";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Schcedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

export default App;

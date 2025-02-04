import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Schedule from "./components/Schedule";
import Test from "./pages/Test";
import Home from "./pages/Home";


function App() {


  
  return (

    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;

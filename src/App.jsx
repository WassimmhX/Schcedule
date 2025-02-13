import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Planning from './pages/Planning';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Schedule from './pages/Schedule';
import Test from './pages/Test';
import Home from './pages/Home';
import PermissionDenied from './error/PermissionDenied';
import ProtectedRoute from './context/ProtectedRoute';
import TeachersSchedules from './pages/TeachersSchedules';
import StudentsSchedules from './pages/StudentsSchedules';
import Dashboard from './AdminArea/Dashboard';
import RoomsSchedules from './pages/RoomsSchedules';

function App() {
  return (
    <Router>
      <div className="pb-10">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/schedules/schedule/:name"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route path="/planning" element={<Planning />} />
        <Route path="schedules/students" element={<StudentsSchedules/>} />
        <Route path="schedules/teachers" element={<TeachersSchedules/>} />
        <Route path="schedules/rooms" element={<RoomsSchedules/>} />

        <Route path="/Test" element={<Test />} />
        <Route path="/login"  element={<Login />}/>

        <Route path="/permission-denied" element={<PermissionDenied />} />
      </Routes>
    </Router>
  );
}

export default App;

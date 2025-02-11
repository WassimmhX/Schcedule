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
import { useEffect, useState } from 'react';
import ProtectedRoute from './context/ProtectedRoute';
import TeachersSchedules from './pages/TeachersSchedules';
import StudentsSchedules from './pages/StudentsSchedules';
import Dashboard from './AdminArea/Dashboard';
import RoomsSchedules from './pages/RoomsSchedules';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest');
  const getList=async(value)=>{
    try {
        const res = await axios.post('http://127.0.0.1:5000/getData', {
          name:value
        });
        return(res.data.message);
      } catch (error) {
        console.error('Error calling Python function', error);
        return [];
      };
  }
  // Sync user state with localStorage when it changes
  useEffect(() => {
    const fetchData=async()=>{
      localStorage.setItem('rooms',JSON.stringify(await getList("rooms")));
      localStorage.setItem('teachers',JSON.stringify(await getList("teachers")));
      localStorage.setItem('classes',JSON.stringify(await getList("classes")));
    }
    fetchData();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);
  
  console.log('User role:', role);
  console.log('User:', user);

  return (
    <Router>
      <div className="pb-10">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {console.log('User role:', role + '  User:', user)}

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
        {/* {localStorage.getItem('user') ? <Route path="/login"  element={<Home/>}/>:<Route path="/login"  element={<Login />}/>} */}
        <Route path="/login"  element={<Login />}/>

        <Route path="/permission-denied" element={<PermissionDenied />} />
        {/* <Route path={localStorage.getItem('user')['role']=='admin' ? "/Schedule":"/planning"} element={<Schedule />} /> */}
        {/* <Route path="/Schedule" element={JSON.parse(localStorage.getItem('user'))?.role === 'admin' 
            ? <Schedule /> : <Planning /> } /> */}
      </Routes>
    </Router>
  );
}

export default App;

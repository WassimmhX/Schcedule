import axios from "axios";
import { BarChart, Users, BookOpen, School } from "lucide-react"
import { useEffect, useState } from "react"

const DashboardHome = () => {
  const [nbUsers,setNbUsers]=useState(0);
  const [nbTeachers,setNbTeachers]=useState(0);
  const [nbRooms,setNbRooms]=useState(0);
  const [nbCourses,setNbCourses]=useState(0);
  const [error, setError] = useState(null);
  const stats = [
    { title: "Total Users", value: nbUsers, icon: Users, color: "bg-blue-500" },
    { title: "Teachers", value: nbTeachers, icon: BookOpen, color: "bg-green-500" },
    { title: "Rooms", value: nbRooms, icon: School, color: "bg-purple-500" },
    { title: "Courses", value: nbCourses, icon: BarChart, color: "bg-yellow-500" },
  ]
  const getNb=async(name)=>{
    try {
      const res = await axios.post("http://localhost:5000/nbData", {
        "name":name,
      });
      console.log(res)
      return res.data.nb;
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response ? err.response.data.error : "Server not reachable");
      console.log(error)
    }
  }
  useEffect(() => {
    getNb('users').then(res=>setNbUsers(res));
    getNb('teachers').then(res=>setNbTeachers(res));
    getNb('rooms').then(res=>setNbRooms(res));
    getNb('classes').then(res=>setNbCourses(res));
  },[]);
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Welcome to the Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <ul className="space-y-3">

          { localStorage.getItem('newUser') ?
            <li className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                New user registered: {JSON.parse(localStorage.getItem('newUser')).name } as {JSON.parse(localStorage.getItem('newUser')).role }
            </li>
            : <></>}
          { localStorage.getItem('newTeacher') ?
            <li className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                New teacher added: {localStorage.getItem('newTeacher')}
            </li>
            : <></>}
          <li className="flex items-center text-gray-300">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            Room 101 booked for next week
          </li>
          { localStorage.getItem('newRoom') ?
            <li className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                New room added: {localStorage.getItem('newRoom')}

            </li>
            : <></>}
        </ul>

      </div>
    </div>
  )
}

export default DashboardHome


'use client';

import { useState, useEffect } from 'react';
import { Trash2, Search, Upload } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const ClassScheduler = () => {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    time: '',
    room: '',
    teacher: '',
    class: '',
  });
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchRooms();
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.post('http://localhost:5000/getData', {
        name: 'sessions',
      });
      setSessions(res.data.message);
    } catch (error) {
      console.error('Error fetching sessions', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.post('http://localhost:5000/getData', {
        name: 'rooms',
      });
      setRooms(res.data.message);
    } catch (error) {
      console.error('Error fetching rooms', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.post('http://localhost:5000/getData', {
        name: 'teachers',
      });
      setTeachers(res.data.message);
    } catch (error) {
      console.error('Error fetching teachers', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.post('http://localhost:5000/getData', {
        name: 'classes',
      });
      setClasses(res.data.message);
    } catch (error) {
      console.error('Error fetching classes', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        'http://localhost:5000/uploadFile',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      toast({
        title: 'File uploaded successfully',
        description: res.data.message,
      });
      fetchSessions(); // Refresh the sessions list
    } catch (error) {
      console.error('Error uploading file', error);
      toast({
        title: 'Error uploading file',
        description:
          error.response?.data?.error ||
          'An error occurred while uploading the file.',
        variant: 'destructive',
      });
    }
  };

  const verifyAvailability = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/verifyAvailability',
        formData
      );
      return res.data.available;
    } catch (error) {
      console.error('Error verifying availability', error);
      return false;
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    const isAvailable = await verifyAvailability();
    if (!isAvailable) {
      toast({
        title: 'Unavailable',
        description:
          'The selected room, teacher, or class is not available at the given time.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/addData', {
        data: formData,
        name: 'sessions',
      });
      toast({
        title: 'Session added successfully',
        description: res.data.message,
      });
      fetchSessions(); // Refresh the sessions list
      setFormData({ time: '', room: '', teacher: '', class: '' }); // Reset form
    } catch (error) {
      console.error('Error adding session', error);
      toast({
        title: 'Error adding session',
        description:
          error.response?.data?.error ||
          'An error occurred while adding the session.',
        variant: 'destructive',
      });
    }
  };

  const deleteSession = async (id) => {
    try {
      const res = await axios.post('http://localhost:5000/deleteData', {
        name: 'sessions',
        key: id,
      });
      toast({
        title: 'Session deleted',
        description: res.data.message,
      });
      fetchSessions(); // Refresh the sessions list
    } catch (error) {
      console.error('Error deleting session', error);
      toast({
        title: 'Error deleting session',
        description:
          error.response?.data?.error ||
          'An error occurred while deleting the session.',
        variant: 'destructive',
      });
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Class Scheduler</h2>

      {/* File Upload Section */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Upload Schedule File</h3>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            onChange={handleFileChange}
            className="bg-gray-700 text-gray-100"
          />
          <Button
            onClick={handleFileUpload}
            className="flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </Button>
        </div>
      </div>

      {/* Add Session Form */}
      <form
        onSubmit={handleAddSession}
        className="mb-6 p-4 bg-gray-800 rounded-lg"
      >
        <h3 className="text-xl font-semibold mb-4">Add Class Session</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              type="datetime-local"
              value={formData.time}
              onChange={handleInputChange}
              className="bg-gray-700 text-gray-100"
              required
            />
          </div>
          <div>
            <Label htmlFor="room">Room</Label>
            <div className="flex">
              <Input
                id="room"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="bg-gray-700 text-gray-100 rounded-r-none"
                list="roomList"
              />
              <Select
                onValueChange={(value) => handleSelectChange('room', value)}
              >
                <SelectTrigger className="w-[180px] bg-gray-700 text-gray-100 rounded-l-none">
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <datalist id="roomList">
              {rooms.map((room) => (
                <option key={room.id} value={room.name} />
              ))}
            </datalist>
          </div>
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <div className="flex">
              <Input
                id="teacher"
                name="teacher"
                value={formData.teacher}
                onChange={handleInputChange}
                className="bg-gray-700 text-gray-100 rounded-r-none"
                list="teacherList"
              />
              <Select
                onValueChange={(value) => handleSelectChange('teacher', value)}
              >
                <SelectTrigger className="w-[180px] bg-gray-700 text-gray-100 rounded-l-none">
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.name}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <datalist id="teacherList">
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.name} />
              ))}
            </datalist>
          </div>
          <div>
            <Label htmlFor="class">Class</Label>
            <div className="flex">
              <Input
                id="class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="bg-gray-700 text-gray-100 rounded-r-none"
                list="classList"
              />
              <Select
                onValueChange={(value) => handleSelectChange('class', value)}
              >
                <SelectTrigger className="w-[180px] bg-gray-700 text-gray-100 rounded-l-none">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <datalist id="classList">
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name} />
              ))}
            </datalist>
          </div>
        </div>
        <Button type="submit" className="mt-4 w-full">
          Add Session
        </Button>
      </form>

      {/* Search and Sessions List */}
      <div className="mb-6 flex items-center bg-gray-700 p-2 rounded-md shadow-md w-64">
        <Search className="text-gray-400 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-gray-200 border-none focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 text-gray-200 divide-y divide-gray-700">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-800 transition-all">
                <td className="px-6 py-4">
                  {new Date(session.time).toLocaleString()}
                </td>
                <td className="px-6 py-4">{session.room}</td>
                <td className="px-6 py-4">{session.teacher}</td>
                <td className="px-6 py-4">{session.class}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-red-400 hover:text-red-600 transition-transform transform hover:scale-110"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassScheduler;

// "use client"

// import { useState, useCallback, useRef } from "react"
// import { Clock, MapPin, User, BookOpen, Upload, Plus, Calendar } from "lucide-react"
// import axios from "axios"

// const ClassSessionForm = () => {
//   const [files, setFiles] = useState([])
//   const [day, setDay] = useState("")
//   const [time, setTime] = useState("")
//   const [room, setRoom] = useState("")
//   const [teacher, setTeacher] = useState("")
//   const [className, setClassName] = useState("")
//   const [error, setError] = useState("")

//   const fileInputRef = useRef(null)

//   // Simulated data for dropdowns
//   const rooms = ["Room 101", "Room 102", "Room 103"]
//   const teachers = ["Mr. Smith", "Ms. Johnson", "Dr. Brown"]
//   const classes = ["Math", "Science", "History"]
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

//   const onDrop = useCallback((acceptedFiles) => {
//     setFiles((prev) => [...prev, ...acceptedFiles])
//   }, [])

//   const handleFileUpload = (e) => {
//     if (e.target.files) {
//       onDrop(Array.from(e.target.files))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       const formData = new FormData()
//       formData.append("day", day)
//       formData.append("time", time)
//       formData.append("room", room)
//       formData.append("teacher", teacher)
//       formData.append("class", className)
//       files.forEach((file) => formData.append("files", file))

//       const res = await axios.post("http://localhost:5000/addClassSession", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       console.log(res)
//       alert("Class Session Added Successfully")
//       // Reset form
//       setDay("")
//       setTime("")
//       setRoom("")
//       setTeacher("")
//       setClassName("")
//       setFiles([])
//     } catch (err) {
//       console.error(err)
//       setError(err.response ? err.response.data.error : "Server not reachable")
//     }
//   }

//   return (
//     <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-2xl p-8 max-w-md mx-auto">
//       <h2 className="text-xl font-semibold text-gray-200 mb-6">Add a New Class Session</h2>

//       {/* File Upload Section */}
//       <div className="mb-6">
//         <div
//           onDrop={(e) => {
//             e.preventDefault()
//             onDrop(Array.from(e.dataTransfer.files))
//           }}
//           onDragOver={(e) => e.preventDefault()}
//           className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:border-teal-500 transition-colors duration-300"
//         >
//           <Upload className="mx-auto text-gray-400 mb-2" size={24} />
//           <p className="text-sm text-gray-400">Drag & drop files here, or click to select files</p>
//           <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
//         </div>
//         <div className="mt-2 flex justify-between items-center">
//           <p className="text-sm text-gray-400">Files selected: {files.length}</p>
//           <button
//             type="button"
//             onClick={() => fileInputRef.current?.click()}
//             className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
//           >
//             Upload Files
//           </button>
//         </div>
//       </div>

//       {/* Class Session Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Day Input */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-400">Day</label>
//           <div className="relative">
//             <select
//               value={day}
//               onChange={(e) => setDay(e.target.value)}
//               required
//               className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2 pl-9 appearance-none"
//             >
//               <option value="">Select a day</option>
//               {days.map((d, index) => (
//                 <option key={index} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>
//             <Calendar className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
//           </div>
//         </div>

//         {/* Time Input */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-400">Time</label>
//           <div className="relative">
//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               required
//               className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2 pl-9"
//             />
//             <Clock className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
//           </div>
//         </div>

//         {/* Room Input */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-400">Room</label>
//           <div className="relative">
//             <input
//               type="text"
//               value={room}
//               onChange={(e) => setRoom(e.target.value)}
//               list="roomList"
//               required
//               className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2 pl-9"
//             />
//             <MapPin className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
//             <datalist id="roomList">
//               {rooms.map((r, index) => (
//                 <option key={index} value={r} />
//               ))}
//             </datalist>
//           </div>
//         </div>

//         {/* Teacher Input */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-400">Teacher</label>
//           <div className="relative">
//             <input
//               type="text"
//               value={teacher}
//               onChange={(e) => setTeacher(e.target.value)}
//               list="teacherList"
//               required
//               className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2 pl-9"
//             />
//             <User className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
//             <datalist id="teacherList">
//               {teachers.map((t, index) => (
//                 <option key={index} value={t} />
//               ))}
//             </datalist>
//           </div>
//         </div>

//         {/* Class Input */}
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-400">Class</label>
//           <div className="relative">
//             <input
//               type="text"
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//               list="classList"
//               required
//               className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2 pl-9"
//             />
//             <BookOpen className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
//             <datalist id="classList">
//               {classes.map((c, index) => (
//                 <option key={index} value={c} />
//               ))}
//             </datalist>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-500 hover:to-purple-600 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 flex items-center justify-center space-x-2"
//         >
//           <Plus className="w-5 h-5" />
//           <span>Add Class Session</span>
//         </button>
//       </form>

//       {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
//     </div>
//   )
// }

// export default ClassSessionForm

// aaaaaaaaaaaaaaa

// "use client"

// import { useState, useEffect } from "react"
// import { Trash2, Search, Upload } from "lucide-react"
// import axios from "axios"

// const ClassScheduler = () => {
//   const [sessions, setSessions] = useState([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [file, setFile] = useState(null)
//   const [formData, setFormData] = useState({
//     time: "",
//     room: "",
//     teacher: "",
//     class: "",
//   })
//   const [rooms, setRooms] = useState([])
//   const [teachers, setTeachers] = useState([])
//   const [classes, setClasses] = useState([])

//   useEffect(() => {
//     fetchSessions()
//     fetchRooms()
//     fetchTeachers()
//     fetchClasses()
//   }, [])

//   const fetchSessions = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/getData", { name: "sessions" })
//       setSessions(res.data.message)
//     } catch (error) {
//       console.error("Error fetching sessions", error)
//     }
//   }

//   const fetchRooms = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/getData", { name: "rooms" })
//       setRooms(res.data.message)
//     } catch (error) {
//       console.error("Error fetching rooms", error)
//     }
//   }

//   const fetchTeachers = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/getData", { name: "teachers" })
//       setTeachers(res.data.message)
//     } catch (error) {
//       console.error("Error fetching teachers", error)
//     }
//   }

//   const fetchClasses = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/getData", { name: "classes" })
//       setClasses(res.data.message)
//     } catch (error) {
//       console.error("Error fetching classes", error)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0])
//   }

//   const handleFileUpload = async () => {
//     if (!file) {
//       alert("No file selected. Please select a file to upload.")
//       return
//     }

//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       const res = await axios.post("http://localhost:5000/uploadFile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       alert("File uploaded successfully: " + res.data.message)
//       fetchSessions() // Refresh the sessions list
//     } catch (error) {
//       console.error("Error uploading file", error)
//       alert("Error uploading file: " + (error.response?.data?.error || "An error occurred while uploading the file."))
//     }
//   }

//   const verifyAvailability = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/verifyAvailability", formData)
//       return res.data.available
//     } catch (error) {
//       console.error("Error verifying availability", error)
//       return false
//     }
//   }

//   const handleAddSession = async (e) => {
//     e.preventDefault()
//     const isAvailable = await verifyAvailability()
//     if (!isAvailable) {
//       alert("The selected room, teacher, or class is not available at the given time.")
//       return
//     }

//     try {
//       const res = await axios.post("http://localhost:5000/addData", {
//         data: formData,
//         name: "sessions",
//       })
//       alert("Session added successfully: " + res.data.message)
//       fetchSessions() // Refresh the sessions list
//       setFormData({ time: "", room: "", teacher: "", class: "" }) // Reset form
//     } catch (error) {
//       console.error("Error adding session", error)
//       alert("Error adding session: " + (error.response?.data?.error || "An error occurred while adding the session."))
//     }
//   }

//   const deleteSession = async (id) => {
//     try {
//       const res = await axios.post("http://localhost:5000/deleteData", {
//         name: "sessions",
//         key: id,
//       })
//       alert("Session deleted: " + res.data.message)
//       fetchSessions() // Refresh the sessions list
//     } catch (error) {
//       console.error("Error deleting session", error)
//       alert(
//         "Error deleting session: " + (error.response?.data?.error || "An error occurred while deleting the session."),
//       )
//     }
//   }

//   const filteredSessions = sessions.filter(
//     (session) =>
//       session.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       session.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       session.room.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   return (
//     <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6">Class Scheduler</h2>

//       {/* File Upload Section */}
//       <div className="mb-6 p-4 bg-gray-800 rounded-lg">
//         <h3 className="text-xl font-semibold mb-4">Upload Schedule File</h3>
//         <div className="flex items-center space-x-4">
//           <input type="file" onChange={handleFileChange} className="bg-gray-700 text-gray-100 p-2 rounded" />
//           <button
//             onClick={handleFileUpload}
//             className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             <Upload className="w-5 h-5" />
//             <span>Upload</span>
//           </button>
//         </div>
//       </div>

//       {/* Add Session Form */}
//       <form onSubmit={handleAddSession} className="mb-6 p-4 bg-gray-800 rounded-lg">
//         <h3 className="text-xl font-semibold mb-4">Add Class Session</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="time" className="block text-sm font-medium text-gray-400">
//               Time
//             </label>
//             <input
//               id="time"
//               name="time"
//               type="datetime-local"
//               value={formData.time}
//               onChange={handleInputChange}
//               className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="room" className="block text-sm font-medium text-gray-400">
//               Room
//             </label>
//             <input
//               id="room"
//               name="room"
//               value={formData.room}
//               onChange={handleInputChange}
//               className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
//               list="roomList"
//               required
//             />
//             <datalist id="roomList">
//               {rooms.map((room) => (
//                 <option key={room.id} value={room.name} />
//               ))}
//             </datalist>
//           </div>
//           <div>
//             <label htmlFor="teacher" className="block text-sm font-medium text-gray-400">
//               Teacher
//             </label>
//             <input
//               id="teacher"
//               name="teacher"
//               value={formData.teacher}
//               onChange={handleInputChange}
//               className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
//               list="teacherList"
//               required
//             />
//             <datalist id="teacherList">
//               {teachers.map((teacher) => (
//                 <option key={teacher.id} value={teacher.name} />
//               ))}
//             </datalist>
//           </div>
//           <div>
//             <label htmlFor="class" className="block text-sm font-medium text-gray-400">
//               Class
//             </label>
//             <input
//               id="class"
//               name="class"
//               value={formData.class}
//               onChange={handleInputChange}
//               className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
//               list="classList"
//               required
//             />
//             <datalist id="classList">
//               {classes.map((cls) => (
//                 <option key={cls.id} value={cls.name} />
//               ))}
//             </datalist>
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Add Session
//         </button>
//       </form>

//       {/* Search and Sessions List */}
//       <div className="mb-6 flex items-center bg-gray-700 p-2 rounded-md shadow-md w-64">
//         <Search className="text-gray-400 w-5 h-5 mr-2" />
//         <input
//           type="text"
//           placeholder="Search sessions..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full bg-transparent text-gray-200 border-none focus:outline-none"
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg">
//           <thead className="bg-gray-800 text-gray-300">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase">Time</th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase">Room</th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase">Teacher</th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase">Class</th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-gray-900 text-gray-200 divide-y divide-gray-700">
//             {filteredSessions.map((session) => (
//               <tr key={session.id} className="hover:bg-gray-800 transition-all">
//                 <td className="px-6 py-4">{new Date(session.time).toLocaleString()}</td>
//                 <td className="px-6 py-4">{session.room}</td>
//                 <td className="px-6 py-4">{session.teacher}</td>
//                 <td className="px-6 py-4">{session.class}</td>
//                 <td className="px-6 py-4">
//                   <button
//                     onClick={() => deleteSession(session.id)}
//                     className="text-red-400 hover:text-red-600 transition-transform transform hover:scale-110"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default ClassScheduler

"use client"

import { useState, useRef, useCallback } from "react"
import { Clock, MapPin, User, BookOpen, Upload, Calendar, PlusCircle, Trash, BookOpenText, ReplaceAll } from "lucide-react"
import axios from "axios"
import Swal from "sweetalert2"

const ClassSessionForm = () => {
  const [files, setFiles] = useState([])
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [room, setRoom] = useState("")
  const [teacher, setTeacher] = useState("")
  const [className, setClassName] = useState("")
  const [subject, setSubject] = useState("")
  const [error, setError] = useState("")
  const [hour, setHour] = useState("")
  const fileInputRef = useRef(null)

  const rooms = JSON.parse(localStorage.getItem("rooms"))
  const teachers = JSON.parse(localStorage.getItem("teachers"))
  const classes = JSON.parse(localStorage.getItem("classes"))
  const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
  const hours=["1.30H","2H","3H"]
  console.log(teachers)
  console.log(rooms)
  console.log(classes)

  const changeSchedules=async()=>{
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      console.log(files)
      const res = await axios.post("http://localhost:5000/changeSchedules", formData);
      console.log('here' +res)
      alert("Schedule changed successfully")
      Swal.fire({
        title: "Schedule changed successfully",
        icon: "success",
        draggable: true
      });
      setFiles([])
    } catch (err) {
      console.log(err.response?.data?.error || "Server not reachable")
      setError(err.response?.data?.error || "Server not reachable")
      Swal.fire({
        title: err.response?.data?.error || "Server not reachable",
        icon: "error",
        draggable: true
      });
    }
  }
  const handleFileUpload = async (e) => {
    if (e.target.files.length > 0) {
      setFiles([e.target.files[0]]) // Replace any existing file
    }
  }
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles([acceptedFiles[0]]) // Only store the first file
    }
  }, [])

  const handleSubmit = async (e) => {
    let time2;
    e.preventDefault()
    if (hour==="1.30H"){
      let h=Number(time.split(':')[0])+1
      let m=Number(time.split(':')[1])+30
      if (m>=60){
        m=m-60
        h+=1
      }
      time2=h+":"+m
    }
    else if (hour==="2H"){
      const h=Number(time.split(':')[0])+2
      const m=time.split(':')[1]
      time2=h+":"+m
    }
    else{
      const h=Number(time.split(':')[0])+3
      const m=time.split(':')[1]
      time2=h+":"+m
    }
    const completTime=time+" - "+time2;
    const schedule={time:completTime,day:day,teacher:teacher,subject:subject,"class":className,room:room}
    try {
      // aaaaaaaaaaaaaaaaaaaaa
      if (rooms.some(room => room.name === schedule.room) != true ) {
        Swal.fire({
          title: "Room Does not exist",
          icon: "error",
          draggable: true
        });
      }else if (teachers.some(teacher => teacher.name === schedule.teacher) != true) {
        Swal.fire({
          title: "Teacher Does not exist",
          icon: "error",
          draggable: true
        });
      } else if (classes.some(classs => classs.name === schedule.class) != true) {
        Swal.fire({
          title: "Class Does not exist",
          icon: "error",
          draggable: true
        });
      }else{
        const res = await axios.post("http://localhost:5000/addData",{"name":"schedule","data":schedule})
        console.log(res)
        // alert("Class Session Added Successfully")
        Swal.fire({
          title: "Class Session Added Successfully",
          icon: "success",
          draggable: true
        });
        setDay("")
        setRoom("")
        setHour("")
        setTime("")
        setTeacher("")
        setSubject("")
        setClassName("")
        setFiles([])
        setError('')
      }
      
    } catch (err) {
      console.error(err)
      setError(err.response ? err.response.data.error : "Server not reachable")
      Swal.fire({
        title: err.response?.data?.error || "Server not reachable",
        icon: "error",
        draggable: true
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#1B2131] p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Class Scheduler</h2>

      <div className="mb-6 p-4 bg-[#1E2737] rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Upload Schedule File</h3>
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-[#1B2131]"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-400">Click to select files</p>
          <input ref={fileInputRef} type="file" accept=".xlsx"  onChange={handleFileUpload} className="hidden" />
        </div>
        
        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center text-gray-300 text-sm bg-[#2A3347] p-2 rounded-lg">
                {file.name}
                <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-center items-center mt-4" >
          <button
            type="submit"
            className="w-200 py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-500 hover:to-purple-600 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 flex items-center justify-center space-x-2"
            onClick={()=>{changeSchedules()}}
          >
            <ReplaceAll  className="w-5 h-5" />
            <span>Change Schedules</span>
          </button>
        </div>
        
      </div>
      
      {/* Class Session Form */}
      <div className="bg-[#1E2737] rounded-lg p-4">
        <h3 className="text-xl font-semibold text-white mb-4">Add Class Session</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400">Day</label>
              <div className="relative">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9 appearance-none"
                >
                  <option value="">Select a day</option>
                  {days.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Time Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400">Time</label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
                />
                <Clock className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Subject Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400">Subject</label>
              <div className="relative">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
                />
                <BookOpenText className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* hours Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400">Hour</label>
              <div className="relative">
                <input
                  type="text"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  list="hoursList"
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
                />
                <Clock className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <datalist id="hoursList">
                <option value="">Select a day</option>
                  {hours.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>

            {/* Room Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400">Room</label>
              <div className="relative">
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  list="roomList"
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
                />
                <MapPin className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <datalist id="roomList">
                  {rooms.map((room,index) => (
                    <option key={index} value={room.name} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Teacher Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400">Teacher</label>
              <div className="relative">
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  list="teacherList"
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
                />
                <User className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <datalist id="teacherList">
                  {teachers.map((teacher) => (
                    <option key={teacher.email} value={teacher.name} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Class Input */}
            <div className="relative md:col-span-2">
              <label className="block text-sm font-medium text-gray-400">Class</label>
              <div className="relative">
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  list="classList"
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
                />
                <BookOpen className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <datalist id="classList">
                  {classes.map((c, index) => (
                    <option key={index} value={c.name} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
          type="submit"
          className="w-full py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-500 hover:to-purple-600 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Session</span>
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}

export default ClassSessionForm

"use client"

import { useState, useRef, useCallback } from "react"
import { Clock, MapPin, User, BookOpen, Upload, Calendar, PlusCircle, Trash, BookOpenText } from "lucide-react"
import axios from "axios"

const ClassSessionForm = () => {
  const [files, setFiles] = useState([])
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [room, setRoom] = useState("")
  const [teacher, setTeacher] = useState("")
  const [className, setClassName] = useState("")
  const [subject, setSubject] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const rooms = localStorage.getItem("rooms")
  const teachers = localStorage.getItem("teachers")
  const classes = localStorage.getItem("classes")
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const hours=["1.30H","2H","3H"]
  const handleFileUpload = async (e) => {
    if (e.target.files.length > 0) {
      setFiles([e.target.files[0]]) // Replace any existing file
      try {
        const formData = new FormData()
        formData.append("file", e.target.files[0]) // Send only one file
  
        const res = await axios.post("http://localhost:5000/uploadFile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
  
        console.log(res)
        alert("File uploaded successfully")
      } catch (err) {
        console.log(err.response?.data?.error || "Server not reachable")
        setError(err.response?.data?.error || "Server not reachable")
      }
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
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("day", day)
      formData.append("time", time)
      formData.append("room", room)
      formData.append("teacher", teacher)
      formData.append("class", className)
      files.forEach((file) => formData.append("files", file))

      const res = await axios.post("http://localhost:5000/addClassSession", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log(res)
      alert("Class Session Added Successfully")
      setDay("")
      setTime("")
      setRoom("")
      setTeacher("")
      setClassName("")
      setFiles([])
    } catch (err) {
      console.error(err)
      setError(err.response ? err.response.data.error : "Server not reachable")
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
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  list="teacherList"
                  required
                  className="mt-1 w-full bg-[#1B2131] text-white border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
                />
                <Clock className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <datalist id="teacherList">
                  {hours.map((t, index) => (
                    <option key={index} value={t} />
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
                  {rooms.map((r, index) => (
                    <option key={index} value={r} />
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
                  {teachers.map((t, index) => (
                    <option key={index} value={t} />
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
                    <option key={index} value={c} />
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

"use client"

import { useState, useCallback, useRef } from "react"
import { Clock, MapPin, User, BookOpen, Upload, Calendar, PlusCircle } from "lucide-react"
import axios from "axios"

const ClassSessionForm = () => {
  const [files, setFiles] = useState([])
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [room, setRoom] = useState("")
  const [teacher, setTeacher] = useState("")
  const [className, setClassName] = useState("")
  const [error, setError] = useState("")

  const fileInputRef = useRef(null)

  // Simulated data for dropdowns
  const rooms = ["Room 101", "Room 102", "Room 103"]
  const teachers = ["Mr. Smith", "Ms. Johnson", "Dr. Brown"]
  const classes = ["Math", "Science", "History"]
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const handleFileUpload = (e) => {
    if (e.target.files) {
      onDrop(Array.from(e.target.files))
    }
  }

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
      // Reset form
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

      {/* File Upload Section */}
      <div className="mb-6 p-4 bg-[#1E2737] rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Upload Schedule File</h3>
        <div
          onDrop={(e) => {
            e.preventDefault()
            onDrop(Array.from(e.dataTransfer.files))
          }}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors duration-300 bg-[#1B2131]"
        >
          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-400">Drag & drop files here, or click to select files</p>
          <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-400">Files selected: {files.length}</p>
            <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
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

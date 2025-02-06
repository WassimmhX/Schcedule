import { useState } from "react"
import { Calendar, Clock, Users, Search, BookOpen, GraduationCap, Building2, Filter } from "lucide-react"
import "./SchedulesTable.css"
import Aurora from "./Aurora"
const Schedules = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const schedules = [
    {
      id: 1,
      title: "Software Engineering",
      type: "lecture",
      time: "09:00 - 10:30",
      location: "Room 101",
      professor: "Dr. Smith",
      students: 45,
      day: "Monday",
      department: "Computer Science",
    },
    {
      id: 2,
      title: "Database Systems",
      type: "lab",
      time: "11:00 - 12:30",
      location: "Lab 203",
      professor: "Dr. Johnson",
      students: 30,
      day: "Monday",
      department: "Computer Science",
    },
    {
      id: 3,
      title: "Digital Marketing",
      type: "seminar",
      time: "14:00 - 15:30",
      location: "Room 305",
      professor: "Prof. Williams",
      students: 60,
      day: "Tuesday",
      department: "Business",
    },
    {
      id: 4,
      title: "Artificial Intelligence",
      type: "lecture",
      time: "10:00 - 11:30",
      location: "Auditorium A",
      professor: "Dr. Brown",
      students: 80,
      day: "Wednesday",
      department: "Computer Science",
    },
    {
      id: 5,
      title: "Business Ethics",
      type: "seminar",
      time: "13:00 - 14:30",
      location: "Room 402",
      professor: "Dr. Davis",
      students: 40,
      day: "Thursday",
      department: "Business",
    },
    {
      id: 6,
      title: "Network Security",
      type: "lab",
      time: "15:00 - 16:30",
      location: "Lab 105",
      professor: "Prof. Miller",
      students: 25,
      day: "Thursday",
      department: "Computer Science",
    },
    {
      id: 7,
      title: "Data Structures",
      type: "lecture",
      time: "09:00 - 10:30",
      location: "Room 201",
      professor: "Dr. Wilson",
      students: 50,
      day: "Friday",
      department: "Computer Science",
    },
    {
      id: 8,
      title: "Marketing Strategy",
      type: "lecture",
      time: "11:00 - 12:30",
      location: "Room 304",
      professor: "Prof. Taylor",
      students: 55,
      day: "Friday",
      department: "Business",
    },
    {
      id: 9,
      title: "Web Development",
      type: "lab",
      time: "14:00 - 15:30",
      location: "Lab 202",
      professor: "Dr. Anderson",
      students: 35,
      day: "Wednesday",
      department: "Computer Science",
    },
    {
      id: 10,
      title: "Financial Management",
      type: "lecture",
      time: "10:00 - 11:30",
      location: "Room 403",
      professor: "Dr. Thomas",
      students: 65,
      day: "Tuesday",
      department: "Business",
    },
    {
      id: 11,
      title: "Operating Systems",
      type: "lecture",
      time: "13:00 - 14:30",
      location: "Room 102",
      professor: "Prof. Martin",
      students: 45,
      day: "Monday",
      department: "Computer Science",
    },
    {
      id: 12,
      title: "Project Management",
      type: "seminar",
      time: "15:00 - 16:30",
      location: "Room 301",
      professor: "Dr. Clark",
      students: 40,
      day: "Friday",
      department: "Business",
    },
  ]

  const filters = [
    { id: "all", label: "All Classes" },
    { id: "lecture", label: "Lectures" },
    { id: "lab", label: "Labs" },
    { id: "seminar", label: "Seminars" },
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800"
      case "lab":
        return "bg-green-100 text-green-800"
      case "seminar":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredSchedules = schedules.filter(
    (schedule) =>
      (activeFilter === "all" || schedule.type === activeFilter) &&
      (schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.department.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="app">
      <Aurora colorStops={["#ff00ff", "#00d8ff", "#7cff67"]} amplitude={1.5} />
      <div className="content">
        <div className="min-h-screen py-8">
          {/* Header */}
          <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 drop-shadow-lg mb-4">
              University Class Schedules
            </h1>
            <p className="text-xl text-cyan-300 drop-shadow-md">
              Browse and find your class schedules
            </p>
          </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by class, professor, or department..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <div className="flex gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          activeFilter === filter.id ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{schedule.title}</h3>
                        <p className="text-gray-600 text-sm">{schedule.professor}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(schedule.type)}`}>
                        {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{schedule.day}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">{schedule.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="text-sm">{schedule.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{schedule.students} students</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="text-sm">{schedule.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSchedules.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedules


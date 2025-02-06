"use client"

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import axios from "axios"
import { Navigate } from "react-router-dom"
import Aurora from "./Aurora"
import "./SchedulesTable.css"

const Schedule = () => {
  const section = "CPI_1"
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("loggedIn")) // Moved loggedIn state here

  if (!loggedIn) {
    return <Navigate to="/login" />
  }

  const [filters, setFilters] = useState({
    professor: "",
    class: "",
    room: "",
  })

  const [name, setName] = useState("")
  const [response, setResponse] = useState([])
  const [events, setEvents] = useState([]) // Moved events state here

  const callPythonFunction = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/returnByClass", {
        class: name,
      })
      setResponse(res.data.message)
    } catch (error) {
      console.error("Error calling Python function", error)
    }
  }
  useEffect(() => {
    setEvents(convertToFullCalendarEvents(response))
  }, [response])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }
  const daysOfWeek = {
    Lundi: 1,
    Mardi: 2,
    Mercredi: 3,
    Jeudi: 4,
    Vendredi: 5,
    Samedi: 6,
    Dimanche: 0,
  }

  const convertToFullCalendarEvents = (backendData) => {
    return backendData.map((item) => {
      const today = new Date()
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()))

      const eventDate = new Date(currentWeekStart)
      eventDate.setDate(eventDate.getDate() + daysOfWeek[item.day])

      const [startHour, startMinute] = item.time.split(" - ")[0].split(":")
      const [endHour, endMinute] = item.time.split(" - ")[1].split(":")

      const startDateTime = new Date(eventDate)
      startDateTime.setHours(Number.parseInt(startHour), Number.parseInt(startMinute), 0)

      const endDateTime = new Date(eventDate)
      endDateTime.setHours(Number.parseInt(endHour), Number.parseInt(endMinute), 0)

      return {
        id: `${item.class}-${item.room}-${item.time}`,
        title: item.subject,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        professor: item.teacher,
        room: item.room,
        class: item.class,
      }
    })
  }

  const filteredEvents = events.filter(
    (event) =>
      (!filters.professor || event.professor.includes(filters.professor)) &&
      (!filters.class || event.class.includes(filters.class)) &&
      (!filters.room || event.room.includes(filters.room)),
  ) 
  return (
    <div className="app min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Aurora colorStops={["#ff00ff", "#00d8ff", "#7cff67"]} amplitude={1.5} />
      <div className="content relative z-10">
        <div className="p-4 m-4 text-center">
        {
/* Supprimer cette div */
}

        
<div className="flex space-x-2 items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border p-1 text-sm text-black"
          />
          <button
            onClick={callPythonFunction}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Call Python
          </button>
        </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in mb-8 text-white text-opacity-90 drop-shadow-lg">
            Schedule Of {section}
          </h1>

          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              events={filteredEvents}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              allDaySlot={false}
              hiddenDays={[0]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              editable={true}
              selectable={true}
              eventContent={(eventInfo) => {
                const startTime = eventInfo.event.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                const endTime = eventInfo.event.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 flex flex-col justify-center text-center">
                    <div className="text-white font-bold text-xs ">{eventInfo.event.title}</div>
                    <div className="text-white text-[12px] ">
                      {startTime} - {endTime}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-white text-[12px] flex items-center justify-center">
                        <span className="mr-1">🏫</span>
                        <span className="text-purple-100">{eventInfo.event.extendedProps.room}</span>
                      </div>
                      <div className="text-white text-[12px] flex items-center justify-center">
                        <span className="mr-1">👨‍🏫</span>
                        <span className="text-purple-100">{eventInfo.event.extendedProps.professor}</span>
                      </div>
                      <div className="text-white text-[12px] flex items-center justify-center">
                        <span className="mr-1">🎓</span>
                        <span className="text-purple-100">{eventInfo.event.extendedProps.class}</span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule


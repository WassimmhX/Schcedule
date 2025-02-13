'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Aurora from './Aurora';
import './SchedulesTable.css';

const Schedule = () => {
  const { name } = useParams();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const mySchedule = name ? name : '';
  const navigate=useNavigate(true);
  const [showMySchedule, setMySchedule] = useState(
    localStorage.getItem('mySchedule') == name
  );
  const [response, setResponse] = useState([]);
  const filters = useState({ professor: '', class: '', room: '' });
  const { yourLocation } = location.state || {};
  
  useEffect(() => {
    callPythonFunction();
  }, []);
  useEffect(() => {
    setEvents(convertToFullCalendarEvents(response));
  }, [response]);
  const getCurrent=(name)=>{
    for(let i=0;i< JSON.parse(localStorage.getItem("classes")).length;i++) {
      if(JSON.parse(localStorage.getItem("classes"))[i].name==name) {
        return "Class";
      }
    }
    
    for(let i=0;i< JSON.parse(localStorage.getItem("teachers")).length;i++) {
      if(JSON.parse(localStorage.getItem("teachers"))[i].name==name) {
        return "Teacher";
      }
    }
    for(let i=0;i< JSON.parse(localStorage.getItem("rooms")).length;i++) {
      if(JSON.parse(localStorage.getItem("rooms"))[i].name==name) {
        return "Room";
      }
    }
  }
  const myScheduleChecked = async (e) => {
    setMySchedule(e.target.checked);
    const user = JSON.parse(localStorage.getItem('user'));
    const schedule = e.target.checked ? mySchedule : '';
    try {
      const res = await axios.post('http://127.0.0.1:5000/updateUserSchedule', {
        schedule: schedule,
        email: user.email,
      });
      localStorage.removeItem('mySchedule');
      localStorage.setItem('mySchedule', schedule);
      localStorage.setItem('currentSchedule', yourLocation);
    } catch (error) {
      console.error('Error calling Python function', error);
    }
  };
  if (!localStorage.getItem('loggedIn')) {
    return <Navigate to="/login" />;
  }

  const callPythonFunction = async () => {
    try {
      // const ScheduleType=localStorage.getItem('ScheduleType');
      let x;
      if (showMySchedule) {
        x = localStorage.getItem('ScheduleType');
      } else {
        x = localStorage.getItem('currentSchedule');
      }
      if(x==null){
        x=getCurrent(mySchedule);
      }
      console.log("x:"+x);
      const res = await axios.post('http://127.0.0.1:5000/returnBy' + x, {
        class: mySchedule,
      });
      console.log(res.data.message)
      setResponse(res.data.message);
    } catch (error) {
      console.error('Error calling Python function', error);
    }
  };

  const daysOfWeek = {
    Lundi: 1,
    Mardi: 2,
    Mercredi: 3,
    Jeudi: 4,
    Vendredi: 5,
    Samedi: 6,
    Dimanche: 0,
  };
  const handleEventClick = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Handle editing logic here
    closeEditModal();
  };

  const convertToFullCalendarEvents = (backendData) => {
    return backendData.map((item) => {
      const today = new Date();
      const currentWeekStart = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const eventDate = new Date(currentWeekStart);
      eventDate.setDate(eventDate.getDate() + daysOfWeek[item.day]);

      const [startHour, startMinute] = item.time.split(' - ')[0].split(':');
      const [endHour, endMinute] = item.time.split(' - ')[1].split(':');
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(
        Number.parseInt(startHour),
        Number.parseInt(startMinute),
        0
      );

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(
        Number.parseInt(endHour),
        Number.parseInt(endMinute),
        0
      );
      return {
        id: `${item.class}-${item.room}-${item.time}`,
        title: item.subject,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        professor: item.teacher,
        room: item.room,
        class: item.class,
      };
    });
  };
  const [events, setEvents] = useState(convertToFullCalendarEvents(response));
  const filteredEvents = events.filter(
    (event) =>
      (!filters.professor || event.professor.includes(filters.professor)) &&
      (!filters.class || event.class.includes(filters.class)) &&
      (!filters.room || event.room.includes(filters.room))
  );
  return (
    <div className="app min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Aurora colorStops={['#ff00ff', '#00d8ff', '#7cff67']} amplitude={1.5} />
      <div className="content relative z-10">
        <div className="p-4 m-4 text-center">
          {/* Supprimer cette div */}

          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in mb-8 text-white text-opacity-90 drop-shadow-lg">
            {name}&apos;s Schedules
          </h1>
          <div className="flex justify-end mb-4">
            <label className="inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={showMySchedule}
                onChange={(e) => myScheduleChecked(e)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              <span className="ml-3 text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                My Schedule
              </span>
            </label>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              events={filteredEvents}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              allDaySlot={false}
              hiddenDays={[0]}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              editable={true}
              selectable={true}
              eventContent={(eventInfo) => {
                const startTime = eventInfo.event.start.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const endTime = eventInfo.event.end.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 flex flex-col justify-center text-center">
                    <div className="text-white font-bold text-xs ">
                      {eventInfo.event.title}
                    </div>
                    <div className="text-white text-[12px] ">
                      {startTime} - {endTime}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-white text-[12px] flex items-center justify-center">
                        <span className="text-purple-100">
                          {eventInfo.event.extendedProps.room}
                        </span>
                      </div>
                      <div className="text-white text-[12px] flex items-center justify-center">
                        <span className="text-purple-100">
                          {eventInfo.event.extendedProps.professor}
                        </span>
                      </div>
                      <div className="text-white text-[12px] flex items-center justify-center">
                        <span className="text-purple-100">
                          {eventInfo.event.extendedProps.class}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
              eventDrop={async(info) => {
                console.log(info.event.start.getHours())
                console.log(info.event.start.getMinutes())
                console.log(info.event.end.getHours())
                console.log(info.event.end.getMinutes())
                const start=((info.event.start.getHours()+"").length==2?(info.event.start.getHours()+""):("0"+info.event.start.getHours()))
                            +":"+((info.event.start.getMinutes()+"").length==2?(info.event.start.getMinutes()+""):(info.event.start.getMinutes()+"0"))
                const end=((info.event.end.getHours()+"").length==2?(info.event.end.getHours()+""):("0"+info.event.end.getHours()))
                            +":"+((info.event.end.getMinutes()+"").length==2?(info.event.end.getMinutes()+""):(info.event.end.getMinutes()+"0"))
                console.log(start+" - "+end)
                const time=start+" - "+end
                const updatedEvent = {
                  id:info.event.id,
                  day: info.event.start.getDay(),
                  subject: info.event.title,
                  time:time,
                  teacher: info.event.extendedProps.professor,
                  "class": info.event.extendedProps.class,
                  room: info.event.extendedProps.room,
                };

                // Save the updated event to the backend
                try {
                  const res = await axios.post('http://127.0.0.1:5000/saveEvent', {"event": updatedEvent});
                  console.log(res.data.message)
                  navigate(0)
                } catch (error) {
                  console.error('Error saving resized event:', error);
                    info.revert();
                }
              }}
              eventResize={(info) => {
                const f=async(info)=>{
                  const updatedEvent = {
                  id: info.event.id,
                  title: info.event.title,
                  start: info.event.start.toISOString(),
                  end: info.event.end.toISOString(),
                  extendedProps: info.event.extendedProps,
                };

                // Save the updated event to the backend
                try {
                  const res = await axios.post('http://127.0.0.1:5000/saveEvent', {"event": updatedEvent});
                  console.log(res)
                } catch (error) {
                  console.error('Error saving resized event:', error);
                    info.revert();
                }}
                f(info)
              }}
            />
          </div>
        </div>
        {/* Popup */}
        {showPopup && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white/90 rounded-2xl shadow-2xl p-6 max-w-md w-full transition-transform transform scale-105 hover:scale-100">
            {/* Event Title */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedEvent.title}</h2>
            
            {/* Event Details */}
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Professor:</strong> {selectedEvent.extendedProps.professor}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Room:</strong> {selectedEvent.extendedProps.room}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Class:</strong> {selectedEvent.extendedProps.class}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Time:</strong>{' '}
              {selectedEvent.start.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {selectedEvent.end.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
        
            <div className="flex w-full justify-between items-center mt-6">
              {/* Edit and Delete Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={openEditModal}
                  className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-900 transition"
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
        
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        
          {/* Edit Modal (Hidden by Default) */}
          {isEditModalOpen && ( /* Conditional rendering for the edit modal */
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Event</h3>
                <form onSubmit={handleEditSubmit}>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Title:
                    <input
                      type="text"
                      defaultValue={selectedEvent.title}
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
                    />
                  </label>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Professor:
                    <input
                      type="text"
                      defaultValue={selectedEvent.extendedProps.professor}
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
                    />
                  </label>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Room:
                    <input
                      type="text"
                      defaultValue={selectedEvent.extendedProps.room}
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500"
                    />
                  </label>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>      
      )}
      </div>
    </div>
  );
};

export default Schedule;

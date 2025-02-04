import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const Schedule = () => {

  const [filters, setFilters] = useState({
    professor: '',
    class: '',
    room: '',
  });

  const [name, setName] = useState("");
  const [response, setResponse] = useState([]);

  const callPythonFunction = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/returnByStudent", { class:name });
      setResponse(res.data.message);
      
    } catch (error) {
      console.error("Error calling Python function", error);
    }
  };
  useEffect(()=>{
    setEvents(convertToFullCalendarEvents(response))
  },[response])


  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
  const backendData = [
    {
      room: 'A-KANOUN',
      day: 'Lundi',
      time: '08:30 - 10:00',
      class: 'L2_TIC',
      teacher: 'enstech3',
      subject: 'CR-Architecture des Microprocesseur et Microcontrôleur',
    },
    {
      room: 'A-B',
      day: 'Lundi',
      time: '14:45 - 16:15',
      class: 'L2_TIC',
      teacher: 'enseignant_tech2',
      subject: 'CR-Automatique',
    },
    {
      room: 'A-B',
      day: 'Vendredi',
      time: '08:30 - 10:00',
      class: 'L2_TIC',
      teacher: 'math',
      subject: 'CR-Instrumentation et Métrologie',
    },
    {
      room: 'C-11',
      day: 'Lundi',
      time: '10:15 - 11:45',
      class: 'L2_TIC',
      teacher: 'ens_tech9',
      subject: "CR-Fonctions d'Electronique Analogique",
    },
    {
      room: 'C-11',
      day: 'Mercredi',
      time: '16:30 - 18:00',
      class: 'L2_TIC',
      teacher: 'info89',
      subject: 'CR-Transmission des Données',
    },
  ];
  // Fonction pour transformer les données du backend
  const convertToFullCalendarEvents = (backendData) => {
    return backendData.map((item) => {
      // Obtenir la date du premier jour de la semaine actuelle
      const today = new Date();
      const currentWeekStart = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      // Calculer la date exacte du jour de l'événement
      const eventDate = new Date(currentWeekStart);
      eventDate.setDate(eventDate.getDate() + daysOfWeek[item.day]);

      // Extraire les heures et minutes
      const [startHour, startMinute] = item.time.split(' - ')[0].split(':');
      const [endHour, endMinute] = item.time.split(' - ')[1].split(':');

      // Créer les timestamps complets
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      // Retourner l'événement formaté
      return {
        id: `${item.class}-${item.room}-${item.time}`,
        title: item.subject,
        start: startDateTime.toISOString(), // Format accepté par FullCalendar
        end: endDateTime.toISOString(),
        professor: item.teacher,
        room: item.room,
        class: item.class,
      };
    });
  };
  const [events, setEvents] = useState(
    convertToFullCalendarEvents(response)
  );
  
  const filteredEvents = events.filter(
    (event) =>
      (!filters.professor || event.professor.includes(filters.professor)) &&
      (!filters.class || event.class.includes(filters.class)) &&
      (!filters.room || event.room.includes(filters.room))
  );


  


  return (
    <div className="p-4 m-4">
  <div className="flex space-x-2 items-center">
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
      className="border p-1 text-sm"
    />
    <button onClick={callPythonFunction} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
      Call Python
    </button>
  </div>

  <h1 className="text-lg font-bold mb-2">Emploi du Temps</h1>

  {/* Filtres */}
  <div className="flex space-x-2 mb-2">
    <input
      type="text"
      name="professor"
      placeholder="Professeur"
      className="border p-1 text-sm"
      onChange={handleFilterChange}
    />
    <input
      type="text"
      name="class"
      placeholder="Classe"
      className="border p-1 text-sm"
      onChange={handleFilterChange}
    />
    <input
      type="text"
      name="room"
      placeholder="Salle"
      className="border p-1 text-sm"
      onChange={handleFilterChange}
    />
  </div>

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
      });
      const endTime = eventInfo.event.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 p-1 rounded shadow-md hover:scale-105 transform transition-all duration-200 flex flex-col justify-center text-center">
          <div className="text-white font-bold text-xs">{eventInfo.event.title}</div>
          <div className="text-white text-[10px] mt-0.5">
            {startTime} - {endTime}
          </div>
          <div className="mt-0.5">
            <div className="text-white text-[10px]">
              🏫 <span className="text-black">{eventInfo.event.extendedProps.room}</span>
            </div>
            <div className="text-white text-[10px]">
              👨‍🏫 <span className="text-black">{eventInfo.event.extendedProps.professor}</span>
            </div>
            <div className="text-white text-[10px]">
              🎓 <span className="text-black">{eventInfo.event.extendedProps.class}</span>
            </div>
          </div>
        </div>
      );
    }}
  />
</div>

  );
};

export default Schedule;
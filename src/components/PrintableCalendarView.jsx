import React from 'react';
import PropTypes from 'prop-types';

const WeeklyCalendarPrint = ({ events = [] }) => {
  // Generate time slots from 8 AM to 6 PM
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);
  
  // Get week days (Mon-Sat)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Function to format time for display
  const formatEventTime = (start, end) => {
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };
  
  // Function to check if there's an event at a specific time slot and day
  const getEventAtSlot = (day, hour) => {
    return events.find(event => {
      const eventDate = new Date(event.start);
      const eventHour = eventDate.getHours();
      const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
      return eventDay === day && eventHour === hour;
    });
  };

  // Calculate event height based on duration
  const getEventStyle = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const durationHours = (end - start) / (1000 * 60 * 60);
    return {
      height: `${durationHours * 65}px`,
      backgroundColor: '#8B5CF6', // Purple color matching the image
      color: 'white',
      padding: '6px',
      fontSize: '0.75rem',
      overflow: 'hidden'
    };
  };

  return (
    <div className="hidden print:block w-full">
      <div className="grid grid-cols-[30px_1fr_1fr_1fr_1fr_1fr_1fr] w-full border border-gray-300">
        {/* Header row */}
        <div className="border-b border-r border-gray-300 p-1"></div>
        {weekDays.map(day => (
          <div key={day} className="border-b border-r border-gray-300 p-2 text-center font-bold">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {timeSlots.map(hour => (
          <React.Fragment key={hour}>
            {/* Time column */}
            <div className="border-b border-r border-gray-300 p-1 text-xs text-center">
              {hour}h
            </div>
            
            {/* Day columns */}
            {weekDays.map(day => (
              <div key={`${day}-${hour}`} className="border-b border-r border-gray-300 relative min-h-[45px]">
                {getEventAtSlot(day, hour) && (
                  <div 
                    style={getEventStyle(getEventAtSlot(day, hour))}
                    className="absolute w-full z-10 rounded flex flex-col gap-1"
                  >
                    <div className="text-sm font-medium text-white">
                      {getEventAtSlot(day, hour).title}
                    </div>
                    <div className="text-sm font-bold text-red-500" style={{ fontSize: '0.9rem' }}>
                      {formatEventTime(
                        getEventAtSlot(day, hour).start,
                        getEventAtSlot(day, hour).end
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {getEventAtSlot(day, hour).room}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {getEventAtSlot(day, hour).class}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

WeeklyCalendarPrint.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      room: PropTypes.string,
      class: PropTypes.string
    })
  )
};

export default WeeklyCalendarPrint;
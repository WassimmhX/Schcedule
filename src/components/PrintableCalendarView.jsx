import React from 'react';
import PropTypes from 'prop-types';

const PrintableCalendarView = ({ events = [] }) => {
  // Add validation to ensure event has required properties
  const isValidEvent = (event) => {
    return event && 
           event.start && 
           event.end && 
           event.title &&
           event.id;
  };

  // Group events by day, filtering out invalid events
  const groupedEvents = events
    .filter(isValidEvent)
    .reduce((acc, event) => {
      const day = new Date(event.start).toLocaleDateString('en-US', { weekday: 'long' });
      if (!acc[day]) acc[day] = [];
      acc[day].push(event);
      return acc;
    }, {});

  return (
    <div className="hidden print:block w-full p-4">
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([day, dayEvents]) => (
          <div key={day} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">{day}</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 font-semibold">Time</th>
                  <th className="text-left p-2 font-semibold">Subject</th>
                  <th className="text-left p-2 font-semibold">Room</th>
                  <th className="text-left p-2 font-semibold">Professor</th>
                  <th className="text-left p-2 font-semibold">Class</th>
                </tr>
              </thead>
              <tbody>
                {dayEvents
                  .sort((a, b) => new Date(a.start) - new Date(b.start))
                  .map((event) => (
                    <tr key={event.id} className="border-b border-gray-100">
                      <td className="p-2">
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(event.end).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-2">{event.title}</td>
                      <td className="p-2">{event.extendedProps?.room || '-'}</td>
                      <td className="p-2">{event.extendedProps?.professor || '-'}</td>
                      <td className="p-2">{event.extendedProps?.class || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

PrintableCalendarView.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      extendedProps: PropTypes.shape({
        room: PropTypes.string,
        professor: PropTypes.string,
        class: PropTypes.string
      })
    })
  )
};

PrintableCalendarView.defaultProps = {
  events: []
};

export default PrintableCalendarView;
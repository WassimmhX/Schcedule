import React from "react";

// Define the time slots and days of the week
const timeSlots = [
  "08:30 - 10:00",
  "10:15 - 11:45",
  "14:45 - 16:15",
  "16:30 - 18:00",
];

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const ScheduleTable = () => {
  // Create a grid for the schedule
  const grid = {};

  // Initialize the grid with empty arrays for each day and time slot
  daysOfWeek.forEach((day) => {
    grid[day] = {};
    timeSlots.forEach((time) => {
      grid[day][time] = null; // Initially empty
    });
  });

  // Populate the grid with the schedule data
  scheduleData.forEach(({ subject, day, time, classroom, teacher }) => {
    grid[day][time] = { subject, classroom, teacher };
  });

  return (
    <div>
      <h2>Schedule</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Day</th>
            {timeSlots.map((time) => (
              <th key={time}>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              {timeSlots.map((time) => (
                <td key={time}>
                  {grid[day][time] ? (
                    <div>
                      <strong>{grid[day][time].subject}</strong>
                      <br />
                      {grid[day][time].classroom}
                      <br />
                      {grid[day][time].teacher}
                    </div>
                  ) : (
                    "No class"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;

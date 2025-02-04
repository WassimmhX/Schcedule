import React, { useEffect } from 'react';
import $ from 'jquery'; // jQuery is required for DataTables
import 'datatables.net-dt'; // Import DataTable CSS
import 'datatables.net'; // Import DataTable

const Dashboard = () => {
  useEffect(() => {
    // Initialize DataTable after component has mounted
    $(document).ready(function () {
      $('#myTable').DataTable();
    });
  }, []);

  const data = [
    {
      id: 1,
      name: 'John Doe',
      subject: 'CR-Architecture',
      classroom: 'A-KANOUN',
      day: 'Lundi',
      time: '08:30 - 10:00',
    },
    {
      id: 2,
      name: 'Jane Smith',
      subject: 'CR-Automatique',
      classroom: 'A-B',
      day: 'Lundi',
      time: '14:45 - 16:15',
    },
    {
      id: 3,
      name: 'Mark Lee',
      subject: 'CR-Instrumentation',
      classroom: 'C-11',
      day: 'Vendredi',
      time: '08:30 - 10:00',
    },
  ];

  return (
    <div>
      <h2>Class Schedule</h2>
      <table id="myTable" className="display">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Classroom</th>
            <th>Day</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.subject}</td>
              <td>{item.classroom}</td>
              <td>{item.day}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

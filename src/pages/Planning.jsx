import React, { useState } from "react";
import axios from "axios";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-react';
import DT from 'datatables.net-dt';
import "./App.css";
DataTable.use(DT);
const Planning = () => {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [tableData, setTableData] = useState([]);
  const callPythonFunction = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/returnByStudent", { class:name });
      setResponse(res.data.message);
      setTableData(response);
    } catch (error) {
      console.error("Error calling Python function", error);
    }
  };
  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={callPythonFunction}>Call Python</button>
      <p>Response:</p>
      {Array.isArray(response) ? (
      <ul>
        {response.map((item, index) => (
          <li key={index}>
            <strong>Subject:</strong> {item.subject} <br />
            <strong>Class:</strong> {item.students} <br />
            <strong>Teacher:</strong> {item.teacher} <br />
            <strong>Day:</strong> {item.day} <br />
            <strong>Time:</strong> {item.time} <br />
            <strong>Classroom:</strong> {item.classroom} <br />
          </li>
        ))}
      </ul>
    ) : (
      <p>{response}</p> // Display error or message if it's not an array
    )}
    </div>
  );
};

export default Planning;

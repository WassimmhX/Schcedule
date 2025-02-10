import { useState, useEffect } from "react";

import { Trash2, Search, PlusCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const navigate=useNavigate()
  const [error, setError] = useState(null);
  const addClass = async (classe) => {
    try {
      const res = await axios.post("http://localhost:5000/addData", {
        "data":classe,
        "name":"classes"
      });
      alert("Class Added Successfully");
      return [res.data, "Class Added Successfully"];
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response ? err.response.data.error : "Server not reachable");
      console.log(error)

      return [null, err.response.data.error];
    }
  };
  const deleteClass=async(name)=>{
    try {
      const res = await axios.post('http://127.0.0.1:5000/deleteData', {
        name:"classes",
        key:name
      });
      alert(res.data.message);
      navigate(0)
    } catch (error) {
      console.error('Error calling Python function', error);
    };
  }
  const getList=async()=>{
    try {
        const res = await axios.post('http://127.0.0.1:5000/getData', {
          name:"classes"
        });
        console.log(res.data.message);
        return( res.data.message);
      } catch (error) {
        console.error('Error calling Python function', error);
        return [];
      };
  }
  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await getList();
      setClasses(data);
    };
    fetchSchedules();
  }, []);


  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newClass = {  name: newClassName };
    addClass(newClass)
    setNewClassName("");
    navigate(0)
  };

  const filteredClasses = classes.filter( (classe) => 
    classe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-300">Class List</h2>
        <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-md w-64">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input 
            type="text" 
            placeholder="Search classes..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-gray-200 border-none focus:outline-none"
          />
        </div>
      </div>
      
      <form onSubmit={handleAddClass} className="mb-6 flex space-x-4 ">
        <input 
          type="text" 
          placeholder="Enter class name" 
          value={newClassName} 
          onChange={(e) => setNewClassName(e.target.value)}
          className="w-4/5 p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        {/* <button 
          type="submit"
          className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Class</span>
        </button> */}
        <button
          type="submit"
          className="flex items-center space-x-2 justify-center  py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-500 hover:to-purple-600 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 "        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Class</span>
        </button>
      </form>
      
      <div className="table-container overflow-auto max-h-[70vh]">
        <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 text-gray-200 divide-y divide-gray-700">
            {filteredClasses.map((classe) => (
              <tr key={classe.id} className="hover:bg-gray-800 transition-all">
                <td className="px-6 py-4">{classe.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteClass(classe.name)}
                    className="text-red-400 hover:text-red-600 transition-transform transform hover:scale-110"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassesList;

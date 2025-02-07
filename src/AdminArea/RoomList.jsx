import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Trash2, Search, UserPlus } from "lucide-react";
=======
import { Trash2, Search, PlusCircle } from "lucide-react";
import axios from "axios";
>>>>>>> 3ecc709e77248ee0ce551c6da83a26233c50b488

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const getList=async()=>{
    try {
        const res = await axios.post('http://127.0.0.1:5000/getData', {
          name:"rooms"
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
      setRooms(data);
    };
    fetchSchedules();
  }, []);
  useEffect(() => {
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  const handleDelete = (id) => {
    const updatedRooms = rooms.filter((room) => room.id !== id);
    setRooms(updatedRooms);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const newRoom = { id: Date.now(), name: newRoomName };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    setNewRoomName("");
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-300">Room List</h2>
        <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-md w-64">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input 
            type="text" 
            placeholder="Search rooms..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-gray-200 border-none focus:outline-none"
          />
        </div>
      </div>
      
      <form onSubmit={handleAddRoom} className="mb-6 flex space-x-4 ">
        <input 
          type="text" 
          placeholder="Enter room name" 
          value={newRoomName} 
          onChange={(e) => setNewRoomName(e.target.value)}
          className="w-4/5 p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        {/* <button 
          type="submit"
          className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Room</span>
        </button> */}
        <button
          type="submit"
          className="flex items-center space-x-2 justify-center  py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-500 hover:to-purple-600 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 "        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Room</span>
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
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-800 transition-all">
                <td className="px-6 py-4">{room.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(room.id)}
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

export default RoomList;

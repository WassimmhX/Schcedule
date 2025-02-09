import { useState } from "react";
import { User, Mail, UserPlus } from "lucide-react";
import axios from "axios";

const TeacherForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError]=useState("");
  const addTeacher = async () => {
    const teacher={email:email, name:name}
    try {
      const res = await axios.post("http://localhost:5000/addData", {
        "data":teacher,
        "name":"teachers"
      });
      alert("User Added Successfully");
      return [res.data, "User Added Successfully"];
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response ? err.response.data.error : "Server not reachable");
      console.log(error)

      return [null, err.response.data.error];
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Add a New Teacher</h2>
      <form onSubmit={addTeacher} className="space-y-4">
        {/* Name Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400">Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2 pl-9"
            />
            <User className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={22} />
          </div>
        </div>

        {/* Email Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2 pl-9"
            />
            <Mail className="absolute left-2.5 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-500 hover:to-purple-600 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Teacher</span>
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;

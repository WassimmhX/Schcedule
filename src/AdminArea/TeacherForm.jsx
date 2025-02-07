import { useState } from "react";
import { UserPlus } from "lucide-react";

const TeacherForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTeacher = {
      id: Date.now(),
      name,
      email,
    };
    
    // Get existing teachers from localStorage
    const existingTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");

    // Add new teacher
    const updatedTeachers = [...existingTeachers, newTeacher];

    // Save updated teachers to localStorage
    localStorage.setItem("teachers", JSON.stringify(updatedTeachers));

    // Reset form
    setName("");
    setEmail("");

    console.log("Teacher added:", newTeacher);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Add a New Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-teal-500 p-2"
          />
        </div>

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
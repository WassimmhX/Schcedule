import axios from "axios";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, UserCog } from "lucide-react";

const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const addUser = async (user) => {
    try {
      const res = await axios.post("http://localhost:5000/testSignUp", {user});
      alert("User Added Successfully");
      return [res.data, "User Added Successfully"];
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response ? err.response.data.error : "Server not reachable");
      console.log(error)

      return [null, err.response.data.error];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name: name, email: email, password: password, phoneNumber: phoneNumber, role: role, mySchedule: "" } ;
    await addUser(newUser);

    localStorage.setItem('newUser',JSON.stringify({name: name,role: role}))
    // Reset form
    setName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setRole("");
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Add a New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400">Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
            />
            <User className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
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
              className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
            />
            <Mail className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              // has only 8 number
              pattern="[0-9]{8}"
              className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
            />
            <Phone className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Password Input with Reveal Feature */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={4}
              required
              className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9 pr-9"
            />
            <Lock className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400">Role</label>
          <UserCog className="absolute left-2 top-11 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="mt-1 w-full bg-gray-700 text-gray-200 border-none rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2 pl-9"
          >
            <option value="">Select a role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-purple-900 hover:from-blue-500 hover:to-purple-600 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </form>
    </div>
  );
};

export default UserForm;

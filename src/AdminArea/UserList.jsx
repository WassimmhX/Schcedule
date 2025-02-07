import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([JSON.parse(localStorage.getItem('user')),JSON.parse(localStorage.getItem('user')),JSON.parse(localStorage.getItem('user')),JSON.parse(localStorage.getItem('user')),JSON.parse(localStorage.getItem('user')),JSON.parse(localStorage.getItem('user')),JSON.parse(localStorage.getItem('user')),JSON.parse(localStorage.getItem('user')),]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      // setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleEdit = (user) => setEditingUser(user);

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingUser) {
      const updatedUsers = users.map((user) => (user.id === editingUser.id ? editingUser : user));
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setEditingUser(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-300 mb-6">User List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 text-gray-200 divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800 transition-all">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phoneNumber}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-110"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-xl shadow-2xl w-96 backdrop-blur-md border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">Edit User</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Phone</label>
                <input
                  type="tel"
                  value={editingUser.phoneNumber}
                  onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mt-4 flex justify-between">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">Save</button>
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-600 text-gray-300 rounded-md shadow-md hover:bg-gray-500 transition-transform transform hover:scale-105">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
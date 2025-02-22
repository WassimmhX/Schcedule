import { useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TeacherList = () => {
  const [teachers, setTeachers] = useState(
    JSON.parse(localStorage.getItem('teachers')) || []
  );
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const deleteTeacher = async (email) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post('http://127.0.0.1:5000/deleteData', {
            name: 'teachers',
            key: email,
          });

          // alert(res.data.message);

          const updatedTeachers = teachers.filter(
            (teacher) => teacher.email !== email
          );

          localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted.',
            confirmButtonColor: '#2563eb',
            icon: 'success',
          });
          setTeachers(updatedTeachers);
        } catch (error) {
          console.error('Error calling Python function', error);
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your imaginary teacher is safe 😊',
          confirmButtonColor: '#2563eb',
          icon: 'error',
        });
      }
    });
  };

  const updateTeacher = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
      confirmButtonColor: '#2563eb',
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          const res = await axios.post('http://127.0.0.1:5000/updateData', {
            name: 'teachers',
            data: editingTeacher,
          });

          const updatedTeachers = teachers.map((teacher) =>
            teacher.email === editingTeacher.email
              ? { ...teacher, name: editingTeacher.name }
              : teacher
          );
    
          localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
          setTeachers(updatedTeachers);
          setEditingTeacher(null);

          Swal.fire({
            title: res.data.succes, 
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: '#2563eb',
            
          });

        } catch (error) {
          console.error('Error calling Python function', error);
          Swal.fire('Saving failed', error.response.data.error, 'error');
        }

      } else if (result.isDenied) {
        Swal.fire({
          title: 'Changes are not saved', 
          icon: "info",
          confirmButtonText: "OK",
          confirmButtonColor: '#2563eb',
          
        });
      }
    });
    
  };

  const handleEdit = (teacher) => setEditingTeacher(teacher);


  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-300">Teacher List</h2>
        <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-md w-64">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-gray-200 border-none focus:outline-none"
          />
        </div>
      </div>

      <div className="table-container overflow-auto max-h-[70vh]">
        <table className="w-full border-collapse border border-gray-700 shadow-lg rounded-lg">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 text-gray-200 divide-y divide-gray-700">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-800 transition-all">
                <td className="px-6 py-4">{teacher.name}</td>
                <td className="px-6 py-4">{teacher.email}</td>
                <td className="px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-110"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteTeacher(teacher.email)}
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
      {editingTeacher && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-xl shadow-2xl w-96 backdrop-blur-md border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">
              Edit Teacher
            </h3>
            <form onSubmit={updateTeacher} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  value={editingTeacher.name}
                  onChange={(e) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={editingTeacher.email}
                  onChange={(e) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 bg-gray-600 text-gray-300 rounded-md shadow-md hover:bg-gray-500 transition-transform transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;

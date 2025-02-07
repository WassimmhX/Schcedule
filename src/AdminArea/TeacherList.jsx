
import { useState, useEffect } from "react"
import { Pencil, Trash2 } from "lucide-react"


const TeacherList=() => {
  const [teachers, setTeachers] = useState([])
  const [editingTeacher, setEditingTeacher] = useState(null)

  useEffect(() => {
    // Fetch teachers from API or load from local storage
    const storedTeachers = localStorage.getItem("teachers")
    if (storedTeachers) {
      setTeachers(JSON.parse(storedTeachers))
    }
  }, [])

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
  }

  const handleDelete = (id) => {
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== id)
    setTeachers(updatedTeachers)
    localStorage.setItem("teachers", JSON.stringify(updatedTeachers))
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editingTeacher) {
      const updatedTeachers = teachers.map((teacher) => (teacher.id === editingTeacher.id ? editingTeacher : teacher))
      setTeachers(updatedTeachers)
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers))
      setEditingTeacher(null)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teacher List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleEdit(teacher)} className="text-blue-600 hover:text-blue-900 mr-2">
                  <Pencil className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTeacher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Edit Teacher</h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                value={editingTeacher.name}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <input
                type="email"
                value={editingTeacher.email}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div className="mt-4">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherList


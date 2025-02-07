
import { useState } from "react"

const TeacherForm= () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const newTeacher = {
      id: Date.now(),
      name,
      email,
    }

    // Get existing teachers from localStorage
    const existingTeachers = JSON.parse(localStorage.getItem("teachers") || "[]")

    // Add new teacher
    const updatedTeachers = [...existingTeachers, newTeacher]

    // Save updated teachers to localStorage
    localStorage.setItem("teachers", JSON.stringify(updatedTeachers))

    // Reset form
    setName("")
    setEmail("")

    console.log("Teacher added:", newTeacher)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Teacher
      </button>
    </form>
  )
}

export default TeacherForm


import { useState } from "react";
import Layout from "./Layout";
import TeacherForm from "./TeacherForm";
import UserForm from "./UserForm";
import TeacherList from "./TeacherList";
import UserList from "./UserList";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("addTeacher");

  const renderActivePage = () => {
    switch (activePage) {
      case "addTeacher":
        return <TeacherForm />;
      case "addUser":
        return <UserForm />;
      case "teacherList":
        return <TeacherList />;
      case "userList":
        return <UserList />;
      default:
        return <TeacherForm />;
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-2xl p-8 mt-6 max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        <div className="mb-6 flex space-x-4 justify-center">
          {[
            { label: "Add Teacher", page: "addTeacher" },
            { label: "Add User", page: "addUser" },
            { label: "Teacher List", page: "teacherList" },
            { label: "User List", page: "userList" },
          ].map(({ label, page }) => (
            <button
              key={page}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activePage === page
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => setActivePage(page)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Render Active Page Content */}
        <div className="bg-gray-800 rounded-lg shadow-inner p-6 text-gray-200">
          {renderActivePage()}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

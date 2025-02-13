import { UserCircle, Home, Users, BookOpen, School, GraduationCap, CalendarSync } from "lucide-react";
import Aurora from "../pages/Aurora";

const Layout = ({ children, setActivePage, activePage}) => {
  return (
    <div className="relative min-h-screen mt-10 m-4">
      {/* Aurora Background */}
      <Aurora colorStops={["#ff00ff", "#00d8ff", "#7cff67"]} amplitude={1.5} />

      {/* Content Wrapper */}
      <div className="relative z-10 flex h-full ">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-xl backdrop-blur-md rounded-l-3xl">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Dashboard
            </h1>
          </div>
          <nav className="mt-8 space-y-4">
          {[
              { name: "dashboard", label: "Dashboard", icon: Home },
              { name: "userList", label: "Users", icon: Users, group: ["userList", "addUser"] },
              { name: "teacherList", label: "Teachers", icon: BookOpen, group: ["teacherList", "addTeacher"] },
              { name: "roomList", label: "Rooms", icon: School },
              { name: "classList", label: "Classes", icon: GraduationCap },
              { name: "EditSchedule", label: "Edit Schedule", icon: CalendarSync },
            ].map(({ name, label, icon: Icon, group }) => (
              <a
                key={name}
                onClick={() => setActivePage(name)}
                className={`flex items-center py-3 px-4 text-white transition rounded-md cursor-pointer 
                  ${(group ? group.includes(activePage) : activePage === name) ? "bg-gray-700/50 scale-105 font-semibold shadow-md" : "hover:bg-gray-700/50 hover:scale-105"}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-900/80 backdrop-blur-sm text-gray-300 rounded-r-3xl">
          <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-md rounded-tr-3xl">
            <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold tracking-wide">University Admin</h2>
              <div className="flex items-center">
                <UserCircle className="w-8 h-8 text-gray-400" />
                <span className="ml-2 text-gray-200">Admin</span>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto py-8 px-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

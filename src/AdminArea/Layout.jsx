import { UserCircle, Home, Users, BookOpen, School, GraduationCap, CalendarSync } from "lucide-react";
import Aurora from "../pages/Aurora";

const Layout = ({ children, setActivePage}) => {
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
            <a
              onClick={() => setActivePage("dashboard")}
              className="flex items-center py-3 px-4 text-white transition hover:bg-gray-700/50 hover:scale-105 rounded-md"
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a
              onClick={() => setActivePage("userList")}

              className="flex items-center py-3 px-4 text-white transition hover:bg-gray-700/50 hover:scale-105 rounded-md"
            >
              <Users className="w-5 h-5 mr-3" />
              Users
            </a>
            <a
              onClick={() => setActivePage("teacherList")}
              className="flex items-center py-3 px-4 text-white transition hover:bg-gray-700/50 hover:scale-105 rounded-md"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              Teachers
            </a>
            <a
              onClick={() => setActivePage("roomList")}
              className="flex items-center py-3 px-4 text-white transition hover:bg-gray-700/50 hover:scale-105 rounded-md"
            >
              <School className="w-5 h-5 mr-3" />
              Rooms
            </a>
            <a
              onClick={() => setActivePage("classList")}
              className="flex items-center py-3 px-4 text-white transition hover:bg-gray-700/50 hover:scale-105 rounded-md"
            >
              {/* <BookMarked className="w-5 h-5 mr-3" /> */}
              <GraduationCap className="w-5 h-5 mr-3" />
              Classes
            </a>
            <a
              onClick={() => setActivePage("EditSchedule")}
              className="flex items-center py-3 px-4 text-white transition hover:bg-gray-700/50 hover:scale-105 rounded-md"
            >
              {/* <BookMarked className="w-5 h-5 mr-3" /> */}
              <CalendarSync className="w-5 h-5 mr-3" />
              Edit Schedule
            </a>
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

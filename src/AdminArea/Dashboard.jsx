import { useState } from 'react';
import Layout from './Layout';
import TeacherForm from './TeacherForm';
import UserForm from './UserForm';
import TeacherList from './TeacherList';
import UserList from './UserList';
import RoomList from './RoomList';
import DashboardHome from './DashboardHome';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'addTeacher':
        return <TeacherForm />;
      case 'addUser':
        return <UserForm />;
      case 'teacherList':
        return <TeacherList />;
      case 'userList':
        return <UserList />;
      case 'roomList':
        return <RoomList />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <Layout setActivePage={setActivePage}>
      <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 shadow-lg rounded-2xl p-8 mt-6 max-w-4xl mx-auto">
        
        {/* Navigation Buttons */}
        {activePage == 'dashboard' ? (
          <></>
        ) : (
          <div className="mb-6 flex space-x-4 justify-center">
            {[
              { label: 'Add User', page: 'addUser' },
              { label: 'Add Teacher', page: 'addTeacher' },
              { label: 'User List', page: 'userList' },
              { label: 'Teacher List', page: 'teacherList' },
              { label: 'Rooms', page: 'roomList' },
            ].map(({ label, page }) => (
              <button
                key={page}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activePage === page
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
                }`}
                onClick={() => setActivePage(page)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Render Active Page Content */}
        <div className="bg-gray-800 rounded-lg shadow-inner p-6 text-gray-200">
          {renderActivePage()}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

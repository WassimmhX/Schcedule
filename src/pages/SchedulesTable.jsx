import { useState } from 'react';
import { Calendar, Search, GraduationCap, Filter } from 'lucide-react';
import './SchedulesTable.css';
import Aurora from './Aurora';
import SpotlightCard from './../components/SpotlightCard';
import scheduleLogo from '/src/assets/calendar.png';

const Schedules = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const schedules = [
    {
      id: 1,
      name: 'L2_TIC',
      type: 'Licence',
    },
    {
      id: 2,
      name: 'L3_INFO_TD1',
      type: 'Licence',
    },
    {
      id: 3,
      name: 'CPI_1_TD1',
      type: 'Prepa',
    },
    {
      id: 4,
      name: 'L3_INFO_TD2',
      type: 'Licence',
    },
    {
      id: 5,
      name: 'CPI_1_TD2',
      type: 'Prepa',
    },
    {
      id: 6,
      name: 'L3_INFO_TD3',
      type: 'Licence',
    },
    {
      id: 7,
      name: 'ING_1_INFO',
      type: 'Ing',
    },
    {
      id: 8,
      name: 'MP_1',
      type: 'Master',
    },
    {
      id: 9,
      name: 'MR_2',
      type: 'Master',
    },
  ];

  // {
  //   id: 9,
  //   title: "MR_2",
  //   type: "Master",
  //   time: "15:00 - 16:30",
  //   location: "Room 301",
  //   professor: "Dr. Clark",
  //   students: 40,
  //   day: "Friday",
  //   department: "Business",
  // },

  const filters = [
    { id: 'all', label: 'All Classes' },
    { id: 'Ing', label: 'Ings' },
    { id: 'Master', label: 'Masters' },
    { id: 'Licence', label: 'Licences' },
    { id: 'Prepa', label: 'Prepas' },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Ing':
        return 'bg-blue-100 text-blue-800';
      case 'Master':
        return 'bg-green-100 text-green-800';
      case 'Licence':
        return 'bg-purple-100 text-purple-800';
      case 'Prepa':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      (activeFilter === 'all' || schedule.type === activeFilter) &&
      (schedule.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app">
      <Aurora colorStops={['#ff00ff', '#00d8ff', '#7cff67']} amplitude={1.5} />
      <div className="content">
        <div className="min-h-screen py-8">
          {/* Header */}
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 drop-shadow-lg mb-4">
                University Class Schedules
              </h1>
              <p className="text-xl text-cyan-300 drop-shadow-md">
                Browse and find your class schedules
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-64 ml-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by class..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <div className="flex gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          activeFilter === filter.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <SpotlightCard
                    className="custom-spotlight-card"
                    spotlightColor="rgba(0, 77, 186, 0.74)"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {/* <Calendar className="h-5 w-5 text-blue-600" /> */}
                        <img
                          src={scheduleLogo}
                          alt="Schedule Logo"
                          className="h-10 w-auto " // Adjust size as needed
                        />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          schedule.type
                        )}`}
                      >
                        {schedule.name.startsWith("L")?'Licence':
                          schedule.name.startsWith("M")?'Master':
                          schedule.name.startsWith("I")?'Ing':
                          schedule.name.startsWith("C")?'Prepa':
                          ""
                        }
                      </span>
                    </div>
                    <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {schedule.name}
                    </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Monday-Saturday</span>
                      </div>

                      <button className=" bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0">
                        Check Schedule
                      </button>
                    </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>

            {filteredSchedules.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No schedules found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;

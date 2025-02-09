import { useEffect, useState } from 'react';
import { Calendar, Search, GraduationCap, Filter } from 'lucide-react';
import './SchedulesTable.css';
import Aurora from './Aurora';
import SpotlightCard from './../components/SpotlightCard';
import scheduleLogo from '/src/assets/upcoming.gif';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeachersSchedules = () => {

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [schedules,setSchedules]=useState([]);
  const getList=async()=>{
    try {
        const res = await axios.post('http://127.0.0.1:5000/getData', {
          name:"teachers"
        });
        console.log(res.data.message);
        return( res.data.message);
      } catch (error) {
        console.error('Error calling Python function', error);
        return [];
      };
  }
  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await getList();
      setSchedules(data);
      localStorage.setItem('currentSchedule','Teacher');

    };
    fetchSchedules();
  }, []);

  const filters = [
    { id: 'all', label: 'All Teachers' },
    { id: 'info', label: 'Computer Science' },
    { id: 'tech', label: 'Physical' },
    { id: 'math', label: 'Mathematic' },
    { id: 'anglais', label: 'English' },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Computer Science':
        return 'bg-blue-100 text-blue-800';
      case 'Physical':
        return 'bg-green-100 text-green-800';
      case 'Mathematic':
        return 'bg-purple-100 text-purple-800';
      case 'English':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const[filteredSchedules,setFilteredSchedules]=useState([])
  useEffect(() => {
    setFilteredSchedules(schedules.filter(
    (schedule) =>
      (activeFilter === 'all' || schedule.name.includes(activeFilter) ) &&
      (schedule.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ));
  },[schedules,searchTerm,activeFilter]);

  const param = {yourLocation :'Teacher'}
  const chekSchedule = (name) => {
    navigate(`/schedules/schedule/${name}`, { state: param });
  }
  

  return (
    <div className="app">
      <Aurora colorStops={['#ff00ff', '#00d8ff', '#7cff67']} amplitude={1.5} />
      <div className="content">
        <div className="min-h-screen py-8">
          {/* Header */}
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 leading-tight animate-fade-in">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 drop-shadow-lg mb-4">
                University Teachers Schedules
              </h1>
              <p className="text-2xl text-cyan-300 drop-shadow-md">
                Browse and find your class schedules
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between leading-tight animate-fade-in">
              <div className="relative w-full md:w-64 ml-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 leading-tight animate-fade-in">
              {filteredSchedules.map((schedule,index) => (
                <div
                  key={index}
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
                          schedule.name.toLowerCase().includes("math")?'Mathematic':
                          schedule.name.toLowerCase().includes("tech")?'Physical':
                          schedule.name.toLowerCase().toLowerCase().includes('info')?'Computer Science':
                          schedule.name.toLowerCase().includes('English')?'English':
                          ""
                        )}`}
                      >
                        {schedule.name.toLowerCase().includes("math")?'Mathematic':
                          schedule.name.toLowerCase().includes("tech")?'Physical':
                          schedule.name.toLowerCase().includes('info')?'Computer Science':
                          schedule.name.toLowerCase().includes('English')?'English':
                          "Generale"
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

                      <button className=" bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 
                      text-white font-medium py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform 
                      hover:-translate-y-1 active:translate-y-0" onClick={() => chekSchedule(schedule.name)}>
                        Check Schedule
                      </button >
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

export default TeachersSchedules;

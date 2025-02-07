'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  LogOut,
  Home,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import isimmLogo from "/src/assets/isimmLogo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const role = user ? JSON.parse(user).role : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.schedule-dropdown')) {
        setIsScheduleOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogOut = () => {
    navigate('/');
    logout();
  };

  const mySchedule = localStorage.getItem("mySchedule");
  console.log('from navbar :', localStorage.getItem("mySchedule"))
  const scheduleOptions = [
    { path: '/schedules/students', label: 'Students' },
    { path: '/schedules/teachers', label: 'Teachers' },
    { path: '/schedules/rooms', label: 'Rooms' },
  ];

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    ...(role
      ? [{ path: '/schedules/schedule/'+mySchedule, label: 'My Schedule', icon: Calendar }]
      : []),
    ...(role=="admin"
      ? [{ path: '/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard }]
      : [])
  ];

  const isActivePath = (path) => location.pathname === path;
  const isScheduleActive = scheduleOptions.some(option => location.pathname === option.path);

  const ScheduleDropdown = () => (
    <div className="relative schedule-dropdown">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsScheduleOpen(!isScheduleOpen);
        }}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isScheduleActive
            ? 'text-blue-600 bg-blue-100'
            : 'text-gray-800 hover:text-blue-600 hover:bg-gray-200'
        }`}
      >
        <ClipboardList className="w-4 h-4 mr-1.5" />
        Schedules
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isScheduleOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isScheduleOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 ">
            {scheduleOptions.map((option) => (
              <Link
                key={option.path}
                to={option.path}
                onClick={() => {
                  setIsScheduleOpen(false);
                  window.location.href = option.path;
                }}
                className={`block px-4 py-2 text-sm ${
                  isActivePath(option.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/30 backdrop-blur-md shadow-sm rounded-lg">
      <div className="max-w-8xl mx-8 px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={isimmLogo}
                alt="ISIMM Logo"
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(link.path)
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-800 hover:text-blue-600 hover:bg-gray-200'
                  }`}
                  // onClick={() => window.location.href = link.path}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {link.label}
                </Link>
              );
            })}
            <ScheduleDropdown />
            {user ? (
              <button
                onClick={handleLogOut}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                LogOut
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActivePath(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {link.label}
              </Link>
            );
          })}
          {/* Mobile Schedule Options */}
          <div className="px-3 py-2">
            <div className="text-sm font-medium text-gray-500 mb-2">Schedules</div>
            {scheduleOptions.map((option) => (
              <Link
                key={option.path}
                to={option.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium  ${
                  isActivePath(option.path)
                    ? 'text-blue-600 bg-blue-50 '
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogOut();
              }}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
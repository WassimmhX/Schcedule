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
  FileSpreadsheet,
  LogIn,
} from 'lucide-react';
import isimmLogo from "/src/assets/isimmLogo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const role = user ? JSON.parse(user).role : null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogOut = () => {
    navigate(0);
    logout();
  };
  const mySchedule=localStorage.getItem("mySchedule")?localStorage.getItem("mySchedule"):""
  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    ...(role
      ? [{ path: '/schedules/'+mySchedule, label: 'My Schedule', icon: Calendar }]
      : []),
    // { path: '/Test', label: 'Test', icon: ClipboardList },
    {
      path: '/schedules',
      label: 'Schedules',
      icon: ClipboardList,
    },
    ...(role=="admin"
      ? [{ path: '/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard }]
      : [])
    
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="fixed bg-white w-full z-50 transition-all duration-300 bg-light">
      <div className="max-w-8xl mx-8 px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={isimmLogo}
                alt="ISIMM Logo"
                className="h-14 w-auto" // Adjust size as needed
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2 ">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(link.path)
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'
                  }`}
                  onClick={() => window.location.href = link.path}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {link.label}
                </Link>
              );
            })}
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

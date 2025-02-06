'use client'

import { useState } from 'react';
import { User, Mail, Lock, Phone, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  
  const { login } = useAuth();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result=await login(email, password);
    const resultState=result[0];
    const resultMessage = result[1];
    if (resultState){
      navigate("/"); // Redirect on successful login
    }
    alert(resultMessage);
  };

  const handleSignUp = async () => {
    const result=await signUp(name, email, password, phone, role);
    const resultState=result[0];
    const resultMessage = result[1];
    if (resultState){
      navigate("/"); // Redirect on successful login
    }
    alert(resultMessage);
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <div className="relative w-[750px] h-[450px] bg-white rounded-lg shadow-lg overflow-hidden flex">
        {/* SVG Border Frame */}
        <svg 
          className="absolute top-0 right-0 h-full w-1/2"
          viewBox="0 0 375 450"
          style={{
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          <path 
            d="M131.25 0 L375 0 L375 450 L0 450 L131.25 0"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>

        <div className="w-1/2 p-10 relative z-10">
          {/* Login Form */}
          <div className={`transform transition-all duration-500 ${isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'}`}>
            <h2 className="text-2xl font-semibold mb-6">Login</h2>
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <User className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="relative mb-4">
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3 mt-6 transition-colors duration-300"
            onClick={handleLogin}>
              Login
            </button>
            <p className="text-center text-gray-600 mt-6">
              Don&apos;t have an account?{' '}
              <button 
                onClick={() => setIsLogin(false)} 
                className="text-black font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Sign Up Form */}
          <div className={`transform transition-all duration-500 ${!isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}`}>
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
            <div className="relative mb-3">
              <input 
                type="text" 
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <User className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="relative mb-3">
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="relative mb-3">
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="relative mb-3">
              <input 
                type="number" 
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <Phone className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="mb-3 relative">
              <div className="flex items-center justify-center space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="role" 
                    value="student"
                    checked={role === "student"}
                    onChange={() => setRole("student")}
                    className="form-radio"
                  />
                  <span className="ml-2">Student</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="role" 
                    value="teacher"
                    checked={role === "teacher"}
                    onChange={() => setRole("teacher")}
                    className="form-radio"
                  />
                  <span className="ml-2">Teacher</span>
                </label>
              </div>
              <UserCheck className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3 mt-1.5 transition-colors duration-300"
            onClick={handleSignUp}>
              Sign Up
            </button>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)} 
                className="text-black font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Welcome Section with Visible Border */}
        <div className="absolute top-0 right-0 w-1/2 h-full text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-black transition-transform duration-500 ease-in-out"
            style={{
              clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)',
              borderLeft: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            <div className="h-full flex items-center justify-center p-10">
              <div className="text-center max-w-[280px] ml-12 mt-8">
                <h1 className="text-3xl font-bold mb-6 ">
                  {isLogin ? 'WELCOME BACK!' : 'JOIN US!'}
                </h1>
                <p className="text-base leading-relaxed opacity-80">
                  {isLogin 
                    ? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, rem?' 
                    : 'Start your journey with us today and discover amazing possibilities!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
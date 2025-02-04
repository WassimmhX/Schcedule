'use client'

import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
                placeholder="Username"
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <User className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="relative mb-4">
              <input 
                type="password" 
                placeholder="Password"
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3 mt-6 transition-colors duration-300">
              Login
            </button>
            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
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
            <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Username"
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <User className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="relative mb-4">
              <input 
                type="email" 
                placeholder="Email"
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <div className="relative mb-4">
              <input 
                type="password" 
                placeholder="Password"
                className="w-full py-2 border-b border-gray-300 focus:border-black outline-none transition-colors duration-300" 
              />
              <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            </div>
            <button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3 mt-6 transition-colors duration-300">
              Sign Up
            </button>
            <p className="text-center text-gray-600 mt-6">
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
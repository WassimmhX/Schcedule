'use client'

import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import './App.css';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="auth-container">
        <div className="form-section">
          {/* Login Form */}
          <div className={`form-content ${!isLogin ? 'hidden' : ''}`}>
            <h2 className="form-title">Login</h2>
            <div className="input-group">
              <input type="text" placeholder="Username" />
              <User className="input-icon" size={20} />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" />
              <Lock className="input-icon" size={20} />
            </div>
            <button className="submit-button">Login</button>
            <p className="switch-text">
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="switch-button">
                Sign Up
              </button>
            </p>
          </div>

          {/* Sign Up Form */}
          <div className={`form-content ${isLogin ? 'hidden' : ''}`}>
            <h2 className="form-title">Sign Up</h2>
            <div className="input-group">
              <input type="text" placeholder="Username" />
              <User className="input-icon" size={20} />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Email" />
              <Mail className="input-icon" size={20} />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" />
              <Lock className="input-icon" size={20} />
            </div>
            <button className="submit-button">Sign Up</button>
            <div className='login-link'>
                <p className="switch-text">
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="switch-button">
                    Login
                </button>
                </p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>WELCOME BACK!</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, rem?</p>
          </div>
        </div>
      </div>
    </div>
  )
}
// components/ResetPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Lock, EyeOff, Eye } from 'lucide-react';
import axios from 'axios';
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
//   const { token } = useParams();
  const navigate = useNavigate();

  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        token:token,
        password: newPassword
      });
      console.log(window.location);
      const data = await response.data;
        setSuccess(data.message);
        toastr.success(data.message, "Success", {
          positionClass: "toast-top-center",
          timeOut: 3000,
          progressBar: true,
        });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
    } catch (error) {
    //   setError('Error resetting password. Please try again.');
    const errorMessage = error.response?.data?.error || 'Failed to reset password';
    setError(errorMessage);
    toastr.error(errorMessage, "Error", {
      positionClass: "toast-top-center",
      timeOut: 3000,
      progressBar: true,
    });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <div className="w-[400px] bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2 border-b border-gray-300 focus:border-black outline-none"
            />
            <Lock
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-2 border-b border-gray-300 focus:border-black outline-none"
            />
            <Lock
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm mb-4">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
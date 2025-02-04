import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simuler une connexion réussie
    localStorage.setItem('isAuthenticated', 'true'); // Sauvegarde l'état de connexion
    setIsAuthenticated(true);
    navigate('/dashboard'); // Redirige vers le dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <div className="w-[750px] h-[450px] bg-white rounded-lg shadow-lg flex">
        <div className="w-1/2 p-10">
          {isLogin ? (
            <>
              <h2 className="text-2xl font-semibold mb-6">Login</h2>
              <button onClick={handleLogin} className="w-full bg-black text-white py-2 rounded mt-4">
                Login
              </button>
              <p className="mt-4">
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-blue-500">
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
              <button className="w-full bg-black text-white py-2 rounded mt-4">
                Sign Up
              </button>
              <p className="mt-4">
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-blue-500">
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

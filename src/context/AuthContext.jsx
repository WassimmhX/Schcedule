import { createContext, useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

  // Users list
  const users = [
    { id: 1, name: "wassim", password: "azerty", role:"admin" },
    { id: 2, name: "ahmed", password: "azerty123", role:"admin" },
    { id: 3, name: "John", password: "azerty12", role:"enseignat" },
    { id: 4, name: "John", password: "azerty1230", role:"etudiant" },
  ];


  const [user, setUser] = useState(null);
  const [isLoggedIn,setIsLoggedIn] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // Login function
  const login = (username, password) => {
    const foundUser = users.find((u) => u.name === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(foundUser));
      console.log('foundUser = '+foundUser.name+'\nlocalStorage = '+ localStorage.getItem('user'))
    } else {
      alert("Invalid username or password");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    Navigate("/login");
  };


  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn
  }
  
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
  )
};


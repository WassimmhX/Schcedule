import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

  // Users list
  const users = [
    { id: 1, name: "John Doe", password: "azerty" },
    { id: 2, name: "John Son", password: "azerty123" },
    { id: 3, name: "John Did", password: "azerty12" },
    { id: 4, name: "John Go", password: "azerty1230" },
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
    } else {
      alert("Invalid username or password");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
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


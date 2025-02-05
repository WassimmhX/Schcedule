import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Users list
  const users = [
    { id: 1, name: "wassim", password: "azerty", role:"admin" },
    { id: 2, name: "aa", password: "aa", role:"admin" },
    { id: 3, name: "John", password: "azerty12", role:"enseignat" },
    { id: 4, name: "John", password: "azerty1230", role:"etudiant" },
  ];

  const [user, setUser] = useState(null);

  // Login function
  const login = (username, password) => {
    const foundUser = users.find((u) => u.name === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      localStorage.setItem("loggedIn", true);
      console.log('foundUser = '+foundUser.name+'\nlocalStorage = '+ localStorage.getItem('user'))
    } else {
      alert("Invalid username or password");
    }
  };

  // sign up function
  const signUp = (username, email, password, phone, role) => {
    const newUser = { name: username, email: email, password: password, phone: phone, role: role } ;
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("loggedIn", true);
    console.log('newUser = '+newUser.name+'\nlocalStorage = '+ localStorage.getItem('user'))
    
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    setUser(null);
    console.log("onLogOut:"+localStorage.getItem('user')+"\tstatus = "+localStorage.getItem('loggedIn'))
  };

  
  return (
    <AuthContext.Provider value={{ user, login, signUp, logout }}>{children}</AuthContext.Provider>
  )
};

export function useAuth() {
  return useContext(AuthContext);
}

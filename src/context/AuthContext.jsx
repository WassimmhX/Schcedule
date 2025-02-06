import axios from "axios";
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Users list

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const testUser= async (email, password)=>{
    try {
      const res = await axios.post("http://localhost:5000/testLogin", { 'email':email, 'password':password});
      return [res.data.message,"Login successful"];
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response ? err.response.data.error : "Server not reachable");
      console.log(error)
      return [null,err.response.data.error];
    }
  }
  // Login function
  const login = async (email, password) => {
    const response = await testUser(email, password);
    const foundUser=response[0];
    const responseMessage=response[1];
    if (foundUser!=null) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      localStorage.setItem("loggedIn", true);
      console.log('foundUser = '+foundUser.name+'\nlocalStorage = '+ localStorage.getItem('user'))
      return [true,responseMessage]
    } else {
      return [false,responseMessage]
    }
  };
  const verifSingUp=async (user)=>{
    try {
      const res = await axios.post("http://localhost:5000/testSignUp",{ user});
      return [res.data.user,"User Added successfully"];
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response ? err.response.data.error : "Server not reachable");
      console.log(error)
      return [null,err.response.data.error];
    }
  }
  // sign up function
  const signUp = async (username, email, password, phone, role) => {
    const newUser = { name: username, email: email, password: password, phoneNumber: phone, role: role } ;
    const result=await verifSingUp(newUser);
    const resultMessage=result[1];
    const userResult=result[0]
    if (userResult){
      setUser(userResult);
      localStorage.setItem("user", JSON.stringify(userResult));
      localStorage.setItem("loggedIn", true);
      console.log('newUser = '+userResult.name+'\nlocalStorage = '+ localStorage.getItem('user'))
    }
    else{
      alert(resultMessage);
    }
    
    
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

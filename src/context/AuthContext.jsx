import axios from "axios";
import { createContext, useState, useContext } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Users list

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const getList=async(value)=>{
    try {
        const res = await axios.post('http://127.0.0.1:5000/getData', {
          name:value
        });
        return(res.data.message);
      } catch (error) {
        console.error('Error calling Python function', error);
        return [];
      };
  }
  
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

      //  zid fonction python traja3li mySchedule 
      localStorage.setItem('mySchedule', foundUser.mySchedule);
      if (foundUser.role == 'admin') {
        localStorage.setItem('users', JSON.stringify(await getList("users")));
      }
      //  add toast success
      toastr.success(`Welcome, ${foundUser.name}!`, "Logged In Successfully", {
        positionClass: "toast-top-right",
        timeOut: 3000,
        progressBar: true,
      });
      console.log('foundUser = '+foundUser.name+'\nlocalStorage = '+ localStorage.getItem('user'))
      return [true,responseMessage]
    } else {
      //  add toast error
      
      toastr.error(responseMessage, "Login Failed", {
        positionClass: "toast-top-right",
        timeOut: 3000,
        progressBar: true,
    });
      return [false,responseMessage]
    }
  };

  const verifSingUp=async (user)=>{
    try {
      const res = await axios.post("http://localhost:5000/testSignUp",{user});
      //  add toast success
      toastr.success(`Welcome, ${user.name}!`, "Signed Up Successfully", {
        positionClass: "toast-top-right",
        timeOut: 3000,
        progressBar: true,
      });
      return [res.data,"User Added successfully"];
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response ? err.response.data.error : "Server not reachable");
      console.log(error)
      toastr.error(err.response ? err.response.data.error : "Server not reachable", "SignUp Failed", {
        positionClass: "toast-top-right",
        timeOut: 3000,
        progressBar: true,
    });
      return [null,err.response.data.error];
    }
  }
  // sign up function
  const signUp = async (username, email, password, phone, role) => {
    const newUser = { name: username, email: email, password: password, phoneNumber: phone, role: role, mySchedule: "" } ;
    const result=await verifSingUp(newUser);
    console.log(result)
    const resultMessage=result[1];
    const userResult=result[0]
    if (userResult){
      setUser(userResult);
      localStorage.setItem("user", JSON.stringify(userResult));
      localStorage.setItem("loggedIn", true);
      console.log('newUser = '+userResult.name+'\nlocalStorage = '+ localStorage.getItem('user'))
      return [true,resultMessage]
    }
    else{
      return [false,resultMessage]
    }
    
    
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("teachers");
    localStorage.clear();
    setUser(null);
    console.log("onLogOut:"+localStorage.getItem('user')+"\tstatus = "+localStorage.getItem('loggedIn'))
    //  add toast success
    toastr.success(`GoodBye, ${user.name}!`, "Logged Out Successfully", {
      positionClass: "toast-top-right",
      timeOut: 3000,
      progressBar: true,
    });
  };

  
  return (
    <AuthContext.Provider value={{ user, login, signUp, logout }}>{children}</AuthContext.Provider>
  )
};

export function useAuth() {
  return useContext(AuthContext);
}

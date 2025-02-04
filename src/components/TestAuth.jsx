import React from 'react';
import { useAuth } from '../context/AuthContext';

export const TestAuth = () => {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();

  const logIn = (e) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setUser({
        name: 'John Doe',
    })
  }

  const logOut = (e) => {
    e.preventDefault()
    setIsLoggedIn(false)
    setUser(null);
  }


  return (
    <>
    <span>User is currently : {isLoggedIn ? 'loggedIn' : 'Logged Out'}</span>
    {isLoggedIn ? (<span>User name : {user.name}</span>) : (<span> User name : {null}</span>)}
    <br/>
    {isLoggedIn ? (<button onClick={(e) => {logOut(e)}}>Log Out</button>) 
                : (<button onClick={(e) => {logIn(e)}}>Log In</button>)
    }
      
      
    </>
  );
};

import React, { useState, useEffect, useContext } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  
  const value = {
    isLoggedIn,
    setIsLoggedIn,
    isAdmin,
    setIsAdmin
  };

  useEffect(() => {
    // Check local storage for stored user data on component mount
    const IsLoggedIn = localStorage.getItem('IsLoggedIn');
    // console.log(IsLoggedIn);
    if (IsLoggedIn==="true" && isLoggedIn === false) {
      const x = IsLoggedIn === "true" ? true : false;
      setIsLoggedIn(x);
      const IsAdmin = localStorage.getItem('IsAdmin');
      const y = IsAdmin === "true" ? true : false;
      setIsAdmin(y);
      
    }
  },[]);
  
  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}
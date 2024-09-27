// AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const loginUser = (userData) => {
    setCurrentUser(userData); // Set user data when logging in
  };

  const logoutUser = () => {
    setCurrentUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

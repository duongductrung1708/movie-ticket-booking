// src/AuthProvider.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const login = (userData) => {
    const { id, ...otherData } = userData;
    localStorage.setItem('user', JSON.stringify({ id, ...otherData }));
    setUser({ id, ...otherData });
    navigate('/home');
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

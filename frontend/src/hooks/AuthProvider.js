import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const login = (userData) => {
    const { accessToken, id, ...otherData } = userData;
    
    if (accessToken) {
      localStorage.setItem('user', JSON.stringify({ accessToken, id, ...otherData }));
      setUser({ accessToken, id, ...otherData });
      
      navigate('/home');
    } else {
      console.error('No valid token found during login.');
    }
  };
  

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [navigate]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const { accessToken } = JSON.parse(storedUser);
  
        if (typeof accessToken === 'string' && accessToken.trim() !== '') {
          try {
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
  
            if (decodedToken.exp < currentTime) {
              logout();
            }
          } catch (error) {
            console.error('Failed to decode token:', error);
            logout();
          }
        } else {
          console.error('Invalid token format');
          logout();
        }
      }
    };
  
    checkTokenExpiration();
  
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, logout]);  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

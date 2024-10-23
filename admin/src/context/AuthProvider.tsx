import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from 'jwt-decode';

interface AuthData {
  accessToken: string;
}

interface AuthContextType {
  user: AuthData | null;
  login: (userData: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthData | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: AuthData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const { accessToken } = JSON.parse(storedUser);
  
        if (typeof accessToken === 'string' && accessToken.trim() !== '') {
          try {
            const decodedToken: any = jwtDecode(accessToken);
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
  }, [user]);

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

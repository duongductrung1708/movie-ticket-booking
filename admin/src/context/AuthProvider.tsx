import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

// Define a type for the context value
interface AuthContextType {
  user: AuthData | null;
  login: (userData: AuthData) => void;
  logout: () => void;
}

// Create the AuthContext with a default value (null initially)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Define the type for the children prop in the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthData | null>(null);

  // Function to log the user in and store the user data
  const login = (userData: AuthData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage
  };

  // Function to log the user out and clear the state
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear localStorage
  };

  // Provide the context value (user and authentication functions)
  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

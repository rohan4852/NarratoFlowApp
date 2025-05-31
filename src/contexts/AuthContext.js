import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Mock login for demo
    setUser({ email, name: 'Demo User', photoURL: 'https://via.placeholder.com/40' });
  };

  const signup = async (email, password, name) => {
    // Mock signup for demo
    setUser({ email, name, photoURL: 'https://via.placeholder.com/40' });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

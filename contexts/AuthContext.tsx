import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text } from 'react-native';

type AuthContextType = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [initialised, setInitialised] = useState(false);

  const setUserId = (id: string | null) => setUserIdState(id);

  useEffect(() => {
    // Future: Load user ID from secure storage or token
    setInitialised(true);
  }, []);

  if (!initialised) {
    return <Text>Loading auth context...</Text>;
  }

  return (
    <AuthContext.Provider value={{ userId, setUserId, isAuthenticated: userId !== null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

// hooks/auth.ts
import { useState } from 'react';

let currentUserId: string | null = null;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUserId);

  const setUserId = (id: string) => {
    currentUserId = id;
    setIsAuthenticated(true);
  };

  return { 
    isAuthenticated,
    setUserId,
    isLoading: false // No async loading needed
  };
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  businessName?: string;
}

interface SignupData {
  email: string;
  password: string;
  businessName: string;
  phone: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = 'paytrack_user';
const TOKEN_KEY = 'paytrack_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (data: SignupData) => {
    const { data: resData } = await api.post('/auth/signup', {
      email: data.email,
      password: data.password,
      name: data.businessName
    });
    localStorage.setItem(TOKEN_KEY, resData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(resData.user));
    setUser(resData.user);
  };

  const loginWithGoogle = async () => {
    throw new Error('Google login not implemented');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  businessName: string;
  phone: string;
  plan: 'starter' | 'business' | 'pro' | null;
  createdAt: string;
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

const STORAGE_KEY = 'paytrack_auth_user';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (u: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, _password: string) => {
    await sleep(800);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const existing: AuthUser = JSON.parse(stored);
      if (existing.email === email) {
        setUser(existing);
        return;
      }
    }
    // Simulate valid login for demo
    const u: AuthUser = {
      id: generateId(),
      email,
      businessName: email.split('@')[0],
      phone: '+237 600000000',
      plan: 'business',
      createdAt: new Date().toISOString(),
    };
    persist(u);
  };

  const signup = async (data: SignupData) => {
    await sleep(1200);
    const u: AuthUser = {
      id: generateId(),
      email: data.email,
      businessName: data.businessName,
      phone: data.phone,
      plan: null,
      createdAt: new Date().toISOString(),
    };
    persist(u);
  };

  const loginWithGoogle = async () => {
    await sleep(600);
    const u: AuthUser = {
      id: generateId(),
      email: 'user@gmail.com',
      businessName: 'Mon Entreprise',
      phone: '+237 600000000',
      plan: null,
      createdAt: new Date().toISOString(),
    };
    persist(u);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
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

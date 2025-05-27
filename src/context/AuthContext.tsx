// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncService from '../storage/AsyncService';
import { Role, User } from '../types';

type AuthContextType = {
  user: User | null;
  role: Role | null;
  login: (role: Role, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      const storedUser = await AsyncService.getItem<User>('user');
      const storedRole = await AsyncService.getItem<Role>('role');
      if (storedUser && storedRole) {
        setUser(storedUser);
        setRole(storedRole);
      }
      setIsLoading(false);
    };
    loadStoredData();
  }, []);

  const login = async (role: Role, email: string, password: string) => {
    // Validação fake (substitua por uma chamada à API)
    if (!email || !password) throw new Error('Preencha todos os campos!');
    const user: User = { email, role };
    await AsyncService.setItem('user', user);
    await AsyncService.setItem('role', role);
    setUser(user);
    setRole(role);
  };

  const logout = async () => {
    await AsyncService.removeItem('user');
    await AsyncService.removeItem('role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
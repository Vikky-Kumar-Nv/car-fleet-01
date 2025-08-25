import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (data: Omit<User, 'id' | 'createdAt'> & { password?: string }) => void;
  updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => void;
  deleteUser: (id: string) => void;
  hasRole: (roles: UserRole[]) => boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Load users if admin
        if (parsedUser.role === 'admin') {
          loadUsers();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authAPI.getUsers(1, 100); // Load first 100 users
  setUsers(response.users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      // Update state
      setUser(response.user);
      // Load users list immediately if logged in user is admin
      if (response.user.role === 'admin') {
        loadUsers();
      }
      return true;
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else if (axiosError.response?.status === 429) {
          toast.error('Too many login attempts. Please try again later.');
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
      
      return false;
    }
  };
  const addUser = async (data: Omit<User, 'id' | 'createdAt'> & { password?: string }) => {
    if (!user || user.role !== 'admin') return; // only admin
    
    try {
      await authAPI.register({
        email: data.email,
        password: data.password || 'defaultPassword123',
        name: data.name,
        phone: data.phone,
        role: data.role
      });
      
      // Reload users list
      await loadUsers();
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError.response?.data?.message || 'Failed to create user');
      } else {
        toast.error('Failed to create user');
      }
    }
  };

  const updateUser = async (id: string, updates: Partial<Omit<User, 'id'>>) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const updatedUser = await authAPI.updateUser(id, updates);
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      
      // If current user updated self, sync in storage & state
      if (user && user.id === id) {
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError.response?.data?.message || 'Failed to update user');
      } else {
        toast.error('Failed to update user');
      }
    }
  };

  const deleteUser = async (id: string) => {
    if (!user || user.role !== 'admin') return;
    if (!id) {
      toast.error('Invalid user id');
      return;
    }
    
    try {
      await authAPI.deleteUser(id);
      
      // Update local state
      setUsers(prev => prev.filter(u => u.id !== id));
      
      // If current user deleted self, logout
      if (user.id === id) {
        logout();
      }
      
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError.response?.data?.message || 'Failed to delete user');
      } else {
        toast.error('Failed to delete user');
      }
    }
  };


  const logout = (redirect = false) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    if (redirect && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
  <AuthContext.Provider value={{ user, users, login, logout, addUser, updateUser, deleteUser, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
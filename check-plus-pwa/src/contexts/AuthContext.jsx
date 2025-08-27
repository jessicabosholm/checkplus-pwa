import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const currentUser = localStorage.getItem('checkplus_current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('=== AUTH CONTEXT LOGIN ===');
    console.log('Received user data:', userData);
    setUser(userData);
    localStorage.setItem('checkplus_current_user', JSON.stringify(userData));
    console.log('User state updated, current user:', userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('checkplus_current_user');
  };

  const getUserData = (key) => {
    if (!user) return null;
    const userData = localStorage.getItem(`checkplus_${user.id}_${key}`);
    return userData ? JSON.parse(userData) : null;
  };

  const setUserData = (key, data) => {
    if (!user) return;
    localStorage.setItem(`checkplus_${user.id}_${key}`, JSON.stringify(data));
  };

  const value = {
    user,
    login,
    logout,
    getUserData,
    setUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


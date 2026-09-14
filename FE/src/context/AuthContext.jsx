import { createContext, useContext, useState, useEffect } from 'react';

// Context quản lý trạng thái đăng nhập admin
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(() => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  });

  const login = (token, user) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setAdminToken(token);
    setAdminUser(user);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
  };

  const isAuthenticated = !!adminToken;

  return (
    <AuthContext.Provider value={{ adminToken, adminUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để dùng AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng trong AuthProvider');
  return ctx;
};

export default AuthContext;

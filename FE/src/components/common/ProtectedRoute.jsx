import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Bảo vệ route admin: nếu chưa đăng nhập thì redirect về trang login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/btc-admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

import { useEffect, useState } from 'react'
import { API_BASE_URL, axiosInstance } from './AxiosInstance';
import { useSelector } from 'react-redux';
import { selectUser } from '../feature/auth/authSlice';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const user = useSelector(selectUser);

  console.log(user);
  useEffect(() => {

    if (!user?.access_token) {
      setIsAuthenticated(false);
      return;
    }

    axiosInstance.get(`${API_BASE_URL}/check-auth`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    })
    .then(() => setIsAuthenticated(true))
    .catch(() => setIsAuthenticated(false));

  }, [user]);

  if (isAuthenticated === null) {
    return <div>Checking Authentication...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} replace />;
}

export default ProtectedRoute

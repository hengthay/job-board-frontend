import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser, selectUserStatus } from '../feature/auth/authSlice'
import NotFound from '../pages/NotFound';
import { Outlet } from 'react-router-dom';

const IsAdmin = () => {

  // Get current user and status
  const user = useSelector(selectUser);
  const status = useSelector(selectUserStatus);

  // If the app is currently talking to the backend
  if(status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Verifying Permissions<span className='animate-pulse'>...</span></div>
      </div>
    );
  }

  // Check user role
  const isAdmin = user?.user?.role === 'admin';

  // If user role is admin we display child component, otherwise display 404 not found page.
  return isAdmin ? <Outlet /> : <NotFound />;
}

export default IsAdmin
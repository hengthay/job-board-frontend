import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, selectUser } from '../feature/auth/authSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Job = () => {

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if(!user) {
        return;
      }

      await dispatch(logoutUser()).unwrap();

      Swal.fire({
        title: "Success",
        text: "Your logout successful!",
        icon: "success",
        timer: 2000
      });

      const timeOut = setTimeout(() => {
        navigate('/login')
      }, 2000);

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your logout failed!",
        icon: "warning",
        timer: 2000
      })
      console.log(error);
    }
  }

  return (
    <div>
      <p className='text-center font-semibold italic mt-20 text-4xl'>Welcome to Job Posting Website</p>
      <button 
        className='bg-cyan-400 p-1.5 text-white rounded-xl min-w-20 cursor-pointer'
        onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  )
}

export default Job
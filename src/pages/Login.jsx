import { useState } from 'react'
import { FaRegUser } from 'react-icons/fa';
import EyeToggleIcon from '../components/Helper/EyeToggleIcon';
import { useDispatch } from 'react-redux';
import { loginUser } from '../feature/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { resetCompanyStatus } from '../feature/company/companySlice';
import { resetJobStatus } from '../feature/jobs/jobSlice';

const Login = () => {

  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);
  // Eye toggle
  const [isCheckedPassword, setIsCheckedPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setIsCheckedPassword(prev => !prev);
  }

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if(!formData.name || !formData.password) {
        setIsError("Please fill out the box!");
        setIsLoading(false);
        return;
      }

      const payload = {...formData};

      await dispatch(loginUser({ payload })).unwrap();
      
      Swal.fire({
        title: 'Success',
        text: "Your login is successful!",
        icon: 'success',
        timer: 2000,
      })
      
      const timeOut = setTimeout(() => {
        dispatch(resetCompanyStatus());
        dispatch(resetJobStatus());
        navigate('/');
      }, 2000);

      // Clear form
      setFormData({name: "", password: ""})

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your login is not success!",
        icon: 'error',
        timer: 2000,
      })
      console.log('error', error?.response?.data?.message);
      setIsError("");
    } finally {
      setIsLoading(false);
      setFormData({name: "", password: ""})
    }
  }
  // console.log('FormData -', formData);
  return (
    <div className='max-w-sm max-sm:w-87.5 mx-auto flex flex-col justify-center items-center w-screen h-screen'>
      <div className='w-full border border-gray-300 rounded-xl shadow-lg bg-white p-4 space-y-4'>
        <h2 className='md:text-2xl text-xl font-semibold text-cyan-500'>Login</h2>
        <div className='my-4'>
          <h3 className='md:text-2xl text-xl font-semibold'>Hello, <br /> Welcome Back</h3>
        </div>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className='w-full flex flex-col space-y-4'>
            <div className='w-full flex flex-col space-y-2 relative'>
              <label htmlFor="name" className='text-gray-500 leading-relaxed tracking-wide text-base'>Username</label>
              <input 
                type="text"
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='bg-gray-200 p-1.5 focus:outline-1.5 focus:outline-cyan-500'
                />
              <FaRegUser size={16} className={`absolute top-11 right-2 transition-colors ease-linear duration-300 text-gray-500`}/>
            </div>
            <div className='w-full flex flex-col space-y-2 relative'>
              <label htmlFor="password" className='text-gray-500 leading-relaxed tracking-wide text-base'>Password</label>
              <input 
                type={isCheckedPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='bg-gray-200 p-1.5 focus:outline-1.5 focus:outline-cyan-500'
                />
              <EyeToggleIcon 
                isChecked={isCheckedPassword}
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          <button 
            type='submit'
            className='w-full my-4 bg-cyan-500 hover:bg-cyan-600 transition-all ease-in-out duration-300 p-1.5 text-white font-medium max-sm:text-sm text-base cursor-pointer'>
              {isLoading ? (<p>Loading<span className='animate-pulse'>...</span></p>) : 'Login'}
          </button>
          <div className='flex justify-end items-center gap-x-1.5'>
            <p className='text-sm text-gray-400'>Don't have an account? </p>
            <Link className='text-sm text-cyan-500 font-semibold' to={'/register'}>Sign Up</Link>
          </div>
        </form>
        {
          isError && (<p className='text-sm text-red-500'>{isError}</p>)
        }
      </div>
    </div>
  )
}

export default Login

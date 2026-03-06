import { useState } from 'react'
import { FaRegUser } from 'react-icons/fa';
import EyeToggleIcon from '../components/Helper/EyeToggleIcon';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUser } from '../feature/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  console.log('user', user);
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
      
      await Swal.fire({
        title: "Successfully",
        text: "Your login is successfully!",
        icon: 'success',
        timer: 2000,
      })

      const timeOut = setTimeout(() => {
        navigate('/')
      }, 2000);

      // Clear form
      setFormData({name: "", password: ""})

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: "Your login is not success!",
        icon: 'error',
        timer: 2000,
      })
      console.log('error', error?.response?.data?.message)
    } finally {
      setIsLoading(false);
      setFormData({name: "", password: ""})
    }
  }
  // console.log('FormData -', formData);
  return (
    <div className='max-w-sm mx-auto flex flex-col justify-center items-center w-screen h-screen'>
      <div className='w-full border border-gray-300 rounded-xl shadow-lg bg-white p-4 space-y-4'>
        <h2 className='text-xl font-semibold text-cyan-500'>Login</h2>
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
              Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

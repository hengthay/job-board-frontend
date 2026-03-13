import { useState } from 'react'
import { FaRegUser } from 'react-icons/fa';
import EyeToggleIcon from '../components/Helper/EyeToggleIcon';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../feature/auth/authSlice';
import Swal from 'sweetalert2';

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCheckedPassword, setIsCheckedPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);

  const togglePasswordVisibility = () => {
    setIsCheckedPassword(prev => !prev);
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if(!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
        setIsError("Please fill out the box!");
        setIsLoading(false);
        return;
      }

      if(!formData.email.includes("@")) {
        setIsError("Invalid Email address!");
        setIsLoading(false);
        return;
      }

      if(formData.password !== formData.confirmPassword) {
        setIsError("Password is not matching!");
        setIsLoading(false);
        return;
      }

      if(formData.password.length < 8 || formData.confirmPassword.length < 8) {
        setIsError("Password must be at least 8 characters!");
        setIsLoading(false);
        return;
      }

      // Payload
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      await dispatch(registerUser({ payload })).unwrap();
      
      Swal.fire({
        title: 'Success',
        text: "Your regiser is successful!",
        icon: 'success',
        timer: 2000,
      })

      const timeOut = setTimeout(() => {
        navigate('/login')
      }, 2000);

      // Clear form
      setFormData({name: "", email: "" , password: "", confirmPassword: "", role: ""})

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your register is not success!",
        icon: 'error',
        timer: 2000,
      })
      console.log('error', error?.response?.data?.message);
      setIsError("");
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  console.log('form', formData);
  return (
    <div className='max-w-sm max-sm:w-87.5 mx-auto flex flex-col justify-center items-center w-screen h-screen'>
      <div className='w-full border border-gray-300 rounded-xl shadow-lg bg-white p-4 space-y-4'>
        <h2 className='text-xl font-semibold text-cyan-500'>Register</h2>
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
              <label htmlFor="email" className='text-gray-500 leading-relaxed tracking-wide text-base'>Email</label>
              <input 
                type='text'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='bg-gray-200 p-1.5 focus:outline-1.5 focus:outline-cyan-500'
                />
              <MdOutlineAlternateEmail size={16} className={`absolute top-11 right-2 transition-colors ease-linear duration-300 text-gray-500`}/>
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
            <div className='w-full flex flex-col space-y-2 relative'>
              <label htmlFor="confirmPassword" className='text-gray-500 leading-relaxed tracking-wide text-base'>Confirm Password</label>
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='bg-gray-200 p-1.5 focus:outline-1.5 focus:outline-cyan-500'
                />
              <EyeToggleIcon 
                isChecked={showConfirmPassword}
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
            <div className='w-full flex flex-col space-y-2 relative'>
              <label htmlFor="role" className='text-gray-500 leading-relaxed tracking-wide text-base'>Select Role</label>
              <select 
                name="role" 
                id="role" 
                className='bg-gray-200 p-1.5 focus:outline-1.5 focus:outline-cyan-500'
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" defaultChecked>Choose Role</option>
                <option value="user">user</option>
                <option value="employer">employer</option>
              </select>

            </div>
          </div>
          <button 
            type='submit'
            className='w-full my-4 bg-cyan-500 hover:bg-cyan-600 transition-all ease-in-out duration-300 p-1.5 text-white font-medium max-sm:text-sm text-base cursor-pointer'>
              Register
          </button>
          <div className='flex justify-end items-center gap-x-1.5'>
            <p className='text-sm text-gray-400'>Already have an account? </p>
            <Link className='text-sm text-cyan-500 font-semibold' to={'/login'}>Sign In</Link>
          </div>
        </form>
        {
          isError && (<p className='text-sm text-red-500'>{isError}</p>)
        }
      </div>
    </div>
  )
}

export default Register
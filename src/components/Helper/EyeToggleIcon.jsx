import React from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const EyeToggleIcon = ({isChecked, onClick}) => {
  return (
    <button
      type='button'
      aria-label={isChecked ? 'Hide Password' : 'Show Password'}
      onClick={onClick}
      className='cursor-pointer'
    > 
      {
        isChecked ? (
          // Open eye
          <FaRegEye  size={16} className={`absolute top-11 right-2 transition-colors ease-linear duration-300 text-gray-500`}/>
        ) : (
          <FaRegEyeSlash  size={16} className={`absolute top-11 right-2 transition-colors ease-linear duration-300 text-gray-500`}/>
        )
      }
    </button>
  )
}

export default EyeToggleIcon
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar'

const MainLayout = () => {

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <div className="flex min-h-screen flex-col w-full">
      {/* NavBar - Full width wrapper */}
      <div className='w-full shadow-md fixed top-0 left-0 right-0 z-50 bg-white'>
        <div className="max-w-8xl mx-auto">
          <NavBar isOpen={isOpen} handleOpenMenu={handleOpenMenu}/>
        </div>
      </div>

      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout

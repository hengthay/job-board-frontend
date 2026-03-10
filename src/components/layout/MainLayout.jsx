import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar'

const MainLayout = () => {

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <div className="flex min-h-screen h-auto w-full">
      {/* Side bars */}
      <div className='w-full mx-auto'>
        {/* NavBar */}
        <div className='max-w-8xl mx-auto shadow-md bg-cyan-100 h-100'>
          <NavBar isOpen={isOpen} handleOpenMenu={handleOpenMenu}/>
        </div>
        <div className='max-w-8xl container mx-auto'>
          <main className="flex-1 min-h-screen overflow-y-auto pt-20 px-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout

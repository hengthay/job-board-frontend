import { useState } from 'react'
import NavBar from '../NavBar';
import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar';

const AdminLayout = () => {
  const [sideBarOpen, setIsSideBarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenSideBar = () => {
    setIsSideBarOpen(prev => !prev);
  }
  
  const handleOpenMenu = () => {
    setIsOpen(prev => !prev);
  }
  
  return (
    <div className="flex min-h-screen flex-col w-full">
      {/* Sidebar */}
      <SideBar sideBarOpen={sideBarOpen} handleOpenSideBar={handleOpenSideBar}/>
      {/* NavBar - Full width wrapper */}
      <div className='w-full shadow-md border border-gray-300 fixed top-0 left-0 right-0 z-50 bg-white'>
        <div className="max-w-8xl mx-auto">
          <NavBar isOpen={isOpen} handleOpenMenu={handleOpenMenu} sideBarOpen={sideBarOpen} handleOpenSideBar={handleOpenSideBar}/>
        </div>
      </div>

      <main className="flex-1 w-full">
        {/* Provide prop to child */}
        <Outlet context={{ sideBarOpen, handleOpenSideBar }}/>
      </main>
    </div>
  )
}

export default AdminLayout
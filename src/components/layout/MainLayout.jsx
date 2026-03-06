import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen h-auto w-full">
      {/* Side bars */}
      <div>
        {/* NavBar */}
        <main className="flex-1 min-h-screen overflow-y-auto pt-20 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

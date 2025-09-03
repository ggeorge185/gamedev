import React from 'react'
import LeftSidebar from './LeftSidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <LeftSidebar />
      <div className="ml-[16%]"> {/* Add this margin to push content right */}
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

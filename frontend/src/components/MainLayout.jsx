import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
         <LeftSidebar/>
        <div className="flex-1 ml-[16%]">
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout
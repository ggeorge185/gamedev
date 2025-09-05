import React from 'react'
<<<<<<< HEAD
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
         <LeftSidebar/>
        <div className="flex-1 ml-[16%]">
            <Outlet/>
        </div>
=======
import LeftSidebar from './LeftSidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <LeftSidebar />
      <div className="ml-[16%]"> {/* Add this margin to push content right */}
        <Outlet />
      </div>
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
    </div>
  )
}

<<<<<<< HEAD
export default MainLayout
=======
export default MainLayout
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e

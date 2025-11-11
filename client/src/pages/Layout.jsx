import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { X, Menu } from 'lucide-react' 
import Loading from '../components/Loading'
import { useSelector } from 'react-redux'

const Layout = () => {
  const user=useSelector((state)=>state.user.value)
  const [sidebarOpen, setSidebarOpen]=useState(false)
  
  return user ? (

    <div className='relative min-h-screen overflow-x-hidden'> 
        

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      
      {sidebarOpen && (
          <div 
              className="fixed inset-0 bg-black/50 z-10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
          />
      )}
      
   
      <div className='flex-1 min-h-screen bg-slate-50 lg:pl-72'> 
        <Outlet/>
      </div>
      
      
      <div className='absolute top-3 right-3 z-30 lg:hidden'>
        {
          sidebarOpen ? 
          <X 
            className='p-2 bg-white rounded-md shadow w-10 h-10 text-gray-600 cursor-pointer' 
            onClick={()=>setSidebarOpen(false)}
          />
          :
          <Menu 
            className='p-2 bg-white rounded-md shadow w-10 h-10 text-gray-600 cursor-pointer' 
            onClick={()=>setSidebarOpen(true)}
          />
        }
      </div>
    </div>
  ) : (
    <Loading/>
  )
}

export default Layout
import React from 'react'
import { assets } from '../assets/assets'
import {Link, useNavigate} from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import {UserButton, useClerk} from '@clerk/clerk-react'
import { useSelector } from 'react-redux'



const Sidebar = ({sidebarOpen, setSidebarOpen}) => {
  const navigate=useNavigate();
  const user = useSelector((state) => state.user.value)
  const {signOut}=useClerk();
  
  return (
    <div className={`
        w-60 xl:w-72 bg-linear-to-r from-slate-800 to-stone-900 border-gray-200 flex flex-col justify-between items-center z-20 h-screen
        fixed top-0 left-0 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        
        transition-transform duration-300 ease-in-out`
    }>
      <div className='w-full'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='w-26 m-7 cursor-pointer rounded-full' />
        <hr className="border-gray-700 mb-3" />
        <MenuItems setSidebarOpen={setSidebarOpen}/>
        <Link to='/create-post' className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer">
        <CirclePlus className='w-5 h-5'/>
        Create Post
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 w-full flex items-center justify-between border-t border-gray-700 p-4">
        <div className="flex gap-3 items-center cursor-pointer">
          <UserButton/>
          <div>
            <h1 className="text-gray-200 font-medium text-sm">{user.full_name}</h1>
            <p className="text-gray-400 text-xs">@{user.username}</p>
          </div>
        </div>
        <LogOut onClick={signOut} className="cursor-pointer text-gray-300" />
      </div>
    </div>
  )
}

export default Sidebar
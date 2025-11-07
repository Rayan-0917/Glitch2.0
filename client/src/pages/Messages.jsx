import React from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Messages = () => {
  const navigate=useNavigate();
  return (
    <div className='min-h-screen relative bg-linear-to-l from-slate-800 to-stone-900'>
      <div className='nax-w-6xl mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2 text-white'>Messages</h1>
        </div>
        <div className='flex flex-col gap-3'>
          {dummyConnectionsData.map((user)=>(
            <div onClick={()=>navigate(`/messages/${user._id}`)} key={user._id} className='max-w-xl flex flex-wrap gap-5 p-6 bg-linear-to-b from-white to-slate-300 shadow rounded-md cursor-pointer'>
              <img src={user.profile_picture} alt="" className='w-10 h-10 rounded-full mx-auto'/>
              <div className='flex-1'>
                <p className='font-medium text-slate-800'>{user.full_name}</p>
                <p className='text-sm text-slate-400'>@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Messages

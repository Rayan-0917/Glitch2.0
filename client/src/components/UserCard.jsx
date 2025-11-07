import React from 'react'
import { dummyUserData } from '../assets/assets'
import { UserPlus, MessageCircle, Plus } from 'lucide-react'

const UserCard = ({user}) => {

    const currentUser=dummyUserData

    const handleFollow=async()=>{

    }

    const handleConnectionRequest=async()=>{

    }

  return (
    <div key={user._id} className='bg-linear-to-b from-white to-slate-300 p-4 pt-6 flex flex-col justify-between w-72 shadow border border-stone-700 rounded-md'>
      <div className='text-center'>
        <img src={user.profile_picture} alt="" className='rounded-full w-16 shadow-md mx-auto' />
        <p className='mt-4 text-black font-bold'>{user.full_name}</p>
        {user.username && <p className='text-gray-800  '>@{user.username}</p>}
        {user.bio && <p className='text-gray-700 mt-2  text-sm px-4 '>{user.bio}</p>}
      </div>
      <div>
        <div className='flex mt-4 gap-2'>
            <button onClick={handleFollow} disabled={currentUser?.following.includes(user._id)} className='flex items-center justify-center w-full gap-2 py-2.5 mt-4 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
                <UserPlus className='w-4 h-4'/>{currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
            </button>
            <button onClick={handleConnectionRequest} className='flex items-center justify-center w-20 mt-4 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
            {
                currentUser?.connections.includes(user._id) ? 
                <MessageCircle className='w-5 h-5 group-hover:scale-105 transition'/>
                :
                <Plus className='w-5 h-5 group-hover:scale-105 transition'/>
            }
        </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard

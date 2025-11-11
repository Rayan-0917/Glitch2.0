import React from 'react'
import { UserPlus, MessageCircle, Plus } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { fetchUser } from '../features/user/userSlice'
import toast from 'react-hot-toast'
import { fetchConnections } from '../features/connections/connectionSlice'

const UserCard = ({user}) => {

    const currentUser=useSelector((state) => state.user.value)
    const {getToken}=useAuth()
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const handleFollow=async()=>{
      try {
        const {data}=await api.post('/api/user/follow', {id: user._id}, {
          headers: {Authorization: `Bearer ${await getToken({template: "jwt"})}`}
        })

        if(data.success){
          toast.success(data.message)
          dispatch(fetchUser(await getToken()))
          
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const handleConnectionRequest=async()=>{
      if(currentUser.connections.includes(user._id)){
        return navigate('/messages/' + user._id)
      }
      try {
        const {data}=await api.post('/api/user/connect', {id: user._id}, {
          headers: {Authorization: `Bearer ${await getToken({template: "jwt"})}`}
        })

        if(data.success){
          toast.success(data.message)
        
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
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

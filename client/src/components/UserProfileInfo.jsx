import { Calendar, MapPin, PenBox } from 'lucide-react'
import moment from 'moment'
import React from 'react'

const UserProfileInfo = ({user, posts, profileId, setShowEdit}) => {
  return (
    <div className='relative py-4 px-6 bg-linear-to-b from-white to bg-slate-300'>
      <div className='flex flex-col items-start gap-6'>
        <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full'>
            <img src={user.profile_picture} alt="" className='absolute rounded-full z-2' />
        </div>
        <div className='w-full pt-16 '>
            <div className='flex flex-col items-start justify-between'>
                <div>
                    <div className='flex items-center gap-1'>
                        <h1 className='text-2xl font-bold text-black'>{user.full_name}</h1>
                    </div>
                    <p>{user.username ? `@${user.username}` : 'Add a username'}</p>
                </div>
                {!profileId && 
                  <button onClick={()=>setShowEdit(true)} className='absolute top-4 right-4 flex items-center gap-2 border cursor-pointer border-gray-300  hover: bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors'>
                    <PenBox className='w-4 h-4'/>Edit
                  </button>
                }
            </div>
            <p className='text-gray-700 max-w-md mt-4'>{user.bio}</p>
            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 mt-4'>
                <span className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4'/>
                  {user.location ? user.location : 'Add location'}
                </span>
                <span className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4'/>
                  Joined <span>{moment(user.createdAt).fromNow()}</span>
                </span>
            </div>
            <div className='flex items-center gap-6 mt-6 border-t border-gray-300 pt-4'>
                <div>
                  <span className='font-bold'>{posts.length}</span>
                  <span className='ml-1.5'>Posts</span>
                </div>
                <div>
                  <span className='font-bold'>{user.followers.length}</span>
                  <span className='ml-1.5'>Followers</span>
                </div>
                <div>
                  <span className='font-bold'>{user.following.length}</span>
                  <span className='ml-1'>Following</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileInfo
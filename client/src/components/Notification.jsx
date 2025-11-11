import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


const Notification = ({t, message}) => {

    const navigate=useNavigate()

  return (
    <div className='max-w-md w-full bg-white shadow-lg rounded-lg flex border border-gray-300 hover:scale-105 transition'>
      <div className='flex-1 p-4'>
        <div className='flex items-start'>
            <img src={message.from_user_id.profile_picture} alt="" className='h-10 w-10 rounded-full shrink-0 mt-0.5' />
            <div className='ml-3 flex-1'>
                <p>{message.from_user_id.full_name}</p>
                <p>{message.text.slice(0, 50)}</p>
            </div>
        </div>
      </div>
      <div className='flex border-l bg-linear-to-r from-indigo-500 to-purple-600 rounded-r-lg flex-col justify-center items-center'>
        <button onClick={()=>{
        navigate(`/messages/${message.from_user_id._id}`)
        toast.dismiss(t.id)
      }} className='p-4 text-white font-semibold'>
        Reply
      </button>
      </div>

    </div>
  )
}

export default Notification

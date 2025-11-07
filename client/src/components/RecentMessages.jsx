import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'
import {Link} from 'react-router-dom'
import moment from 'moment'

const RecentMessages = () => {

    const [messages, setMessages]=useState([])

    const fetchRecentMessages=async()=>{
        setMessages(dummyRecentMessagesData)
    }

    useEffect(()=>{
        fetchRecentMessages()
    }, [])

    
  return (
  
    <div className='bg-white max-w-sm mt-4 p-5 min-h-20 rounded-md shadow text-xs text-slate-800'> 
      <h3 className='font-semibold text-slate-800 mb-4'>Recent Messages</h3>
      <div className='flex flex-col max-h-60 overflow-y-scroll no-scrollbar '>
        {
            messages.map((message, index)=>(
                <Link key={index} className='flex items-start gap-3 py-2 hover:bg-slate-100 border-b border-slate-100 last:border-b-0'>
                    
                    <img src={message.from_user_id.profile_picture} alt="User Profile" className='w-9 h-9 rounded-full shrink-0' />
                    
                    <div className='w-full overflow-hidden'> 
                        
                       
                        <div className='text-black flex justify-between items-center'>
                         
                            <p className='font-semibold pr-2 text-sm'>{message.from_user_id.full_name}</p>
                            <p className='text-[10px] font-light text-gray-500 shrink-0'>{moment(message.createdAt).fromNow()}</p>
                        </div>
                        
                    
                        <div className='text-gray-700 flex justify-between items-center mt-0.5'> 
                            
                            <p className='truncate mr-2'>{message.text ? message.text : 'Sent an attachment'}</p>
                            
                            
                            {!message.seen && (
                                <p className='bg-indigo-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0'>
                                    1
                                </p>
                            )}
                        </div>
                    </div>
                </Link>
            ))
        }
      </div>
    </div>
  )
}

export default RecentMessages
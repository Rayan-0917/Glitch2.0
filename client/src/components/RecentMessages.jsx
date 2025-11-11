import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'


const RecentMessages = () => {

    const [messages, setMessages]=useState([])
    const { user } = useUser()
    const { getToken } = useAuth()

    const fetchRecentMessages=async()=>{
        try {
            const token = await getToken({template: "jwt"})
            const { data } = await api.get('/api/user/recent-messages', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                const groupedMessages = data.messages.reduce((acc, message) => {
                    if (!message.from_user_id) return acc; 

                    const senderId = message.from_user_id._id;
                    if (
                        !acc[senderId] ||
                        new Date(message.createdAt) > new Date(acc[senderId].createdAt)
                    ) {
                        acc[senderId] = message;
                    }
                    return acc;
                }, {});

                const sortedMessages = Object.values(groupedMessages).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setMessages(sortedMessages)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchRecentMessages()
            setInterval(fetchRecentMessages, 30000)
            return () => { clearInterval() }
        }
    }, [user])

    
  return messages.length > 0 ? (
  <div className='bg-white max-w-sm mt-4 p-5 min-h-20 rounded-md shadow text-xs text-slate-800'> 
    <h3 className='font-semibold text-slate-800 mb-4'>Recent Messages</h3>
    <div className='flex flex-col max-h-60 overflow-y-scroll no-scrollbar'>
      {messages.map((message, index) => (
        <Link to={`/messages/${message.from_user_id._id}`} key={index} className="flex items-start gap-3 py-2 hover:bg-slate-100 border-b border-slate-100 last:border-b-0">
          <img src={message.from_user_id.profile_picture} className="w-9 h-9 rounded-full shrink-0" />
          <div className="w-full overflow-hidden">
            <div className="text-black flex justify-between items-center">
              <p className="font-semibold pr-2 text-sm">{message.from_user_id.full_name}</p>
              <p className="text-[10px] font-light text-gray-500 shrink-0">{moment(message.createdAt).fromNow()}</p>
            </div>
            <div className="text-gray-700 flex justify-between items-center mt-0.5">
              <p className="truncate mr-2">{message.text || "Sent an attachment"}</p>
              {!message.seen && (
                <p className="bg-indigo-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0">
                  1
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
) : null;

}

export default RecentMessages
import React, { useEffect, useState } from 'react'
import { Plus, Store } from 'lucide-react'
import moment from 'moment'
import StoryModel from './StoryModel'
import ViewStory from './ViewStory'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const StoriesBar = () => {
  
    const {getToken}=useAuth()

    const [stories, setStories]=useState([])
    const [showModel, setShowModel]=useState(false)
    const [viewStory, setViewStory]=useState(null)

    const fetchStories=async()=>{
        try {
      const token=await getToken({template: "jwt"})
      const {data}=await api.get('/api/story/get', {
        headers: {Authorization: `Bearer ${token}`}
      })

      if(data.success){
        setStories(data.stories)
      }
      else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    }

    useEffect(()=>{
        fetchStories()
    }, [])
  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto p-4'>
      <div className='flex gap-4 pb-5'>
        <div onClick={()=>setShowModel(true)} className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-3/4 cursor-pointer hover:shadow-lg transition-all duration-200 '>
            <div className='h-full flex flex-col items-center justify-center p-4'>
                <div className='size-10 rounded-full flex items-center justify-center mb-3 bg-gray-300'>
                    <Plus className='w-5 h-5 text-black'/> 
                </div>
                <p className='text-sm font-medium text-slate-700 text-center'>Add Story</p>

            </div>
        </div>
        {
        stories.map((story, index) => (
          <div onClick={()=>setViewStory(story)}  key={index} className={`relative rounded-lg bg-linear-to-r from-pink-400 to-blue-500  shadow min-w-30 max-w-40 min-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 ` }>
            <img src={story.user?.profile_picture} alt={story.user?.usernmae} className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-pink-500 shadow' />
            <p className='absolute top-18 left-3 text-black/60 text-sm truncate max-w-24'>{story.content}</p>
            <p className='absolute bottom-1 right-2 z-10 text-white text-xs'>{moment(story.createdAt).fromNow()}</p>
            {
              story.media_type != 'text' && (
                <div className='absolute inset-0 z-1 rounded-lg bg-black overflow-hidden'>
                  {
                    story.media_type == 'image' ?
                      <img src={story.media_url} alt="" className='h-full  w-full object-cover hover:scale-110 transition duration-500  hover:opacity-80' />
                      :
                      <video src={story.media_url} className='h-full w-full object-cover hover:scale-110 transition duration-500  hover:opacity-80'></video>
                  }
                </div>
              )
            }
          </div>
        ))
      }
      </div>
      {showModel && <StoryModel setShowModel={setShowModel} fetchStories={fetchStories}/>}
      {viewStory && <ViewStory viewStory={viewStory} setViewStory={setViewStory}/> }
    </div>
  )
}

export default StoriesBar

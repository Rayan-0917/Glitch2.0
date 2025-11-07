import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const user=dummyUserData
  const navigate=useNavigate()
  const [content, setContent]=useState('')
  const [images, setImages]=useState([])
  const [loading, setLoading]=useState(false)

  const handleSubmit=async()=>{
    
  }
  return (
    <div className='min-h-screen bg-linear-to-b from-black via-gray-900 to-gray-800'>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-white'>Create Post</h1>
        </div>
        <div className='max-w-xl  bg-linear-to-b from-white to bg-slate-300 p-4 rounded-md shadow-md space-y-4'>
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow' />
            <div>
              <h2 className='font-semibold'>{user.full_name}</h2>
              <p className='text-gray-800'>@{user.username}</p>
            </div>
          </div>
          <textarea onChange={(e) => setContent(e.target.value)} value={content} className='w-full resize-none max-h-20 mt-4 outline-none placeholder-gray-400' placeholder="What's on your mind" />
          {
            images.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
              {images.map((image, i) => (
                <div key={i} className='relative group'>
                  <img src={URL.createObjectURL(image)} className='h-20 rounded-md' alt="" />
                  <div onClick={() => setImages(images.filter((_, index) => index !== i))} className='absolute hidden group-hover:flex justify-center items-center top-2 right-2 bg-black/40 rounded-md cursor-pointer'>
                    <X className='h-6 w-6 text-white' />
                  </div>
                </div>
              ))}
            </div>
          }
          <div className='flex items-center  justify-between pt-3 border-t border-gray-300'>
            <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 transition cursor-pointer'>
              <Image className='size-6' />
            </label>
            <input type="file" id='images' accept='image/*' hidden multiple onChange={(e) => setImages([...images, ...e.target.files])} />
            <button disabled={loading} onClick={() => toast.promise(handleSubmit(),
              {
                loading: 'uploading...',
                success: <p>Post added successfully!</p>,
                error: <p>Post not added</p>
              })} className='flex items-center justify-center w-20 py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 font-medium hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
              Post
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CreatePost

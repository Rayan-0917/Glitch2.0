import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const navigate = useNavigate()

  const fetchFeed = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/post/feed', {
        headers: {
          Authorization: `Bearer ${await getToken({ template: "jwt" })}`
        }
      })

      if (data.success) {
        setFeed(data.posts)
      } else {
        toast.error(data.message)
      }
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='min-h-screen w-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8 bg-linear-to-l from-slate-800 to-stone-900'>
      <div className='w-full max-w-2xl'>
        <StoriesBar />

        {feed.length > 0 ? (
          <div className='p-4 space-y-6'>
            {feed.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-96 0 rounded-xl text-white p-8 m-4 shadow-lg text-center'>
            <h2 className='text-2xl font-bold mb-4'>Welcome to Glitch!</h2>
            <p className='text-md'>
              Follow people you know to see what they are up to. Your feed will show posts here.
            </p>
            <button onClick={()=>navigate('/search')} className='flex items-center justify-center gap-2 py-3 px-6 mt-6 mx-auto rounded bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow'>
              Look for people you know
            </button>
          </div>
        )}
      </div>

      <div className='max-xl:hidden sticky top-0'>
        <RecentMessages />
      </div>
    </div>
  )
}

export default Feed

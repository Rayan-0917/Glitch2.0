import React, { useEffect, useState } from 'react'
import {dummyPostsData} from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'

const Feed = () => {
  const [feed, setFeed]=useState([])
  const [loading, setLoading]=useState(true)

  const fetchFeed=async()=>{
    setFeed(dummyPostsData)
    setLoading(false)
  }

  useEffect(()=>{
    fetchFeed()
  }, [])

  return !loading ? (
    <div>
      <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8 bg-linear-to-l from-slate-800 to-stone-900'>
        <div>
          <StoriesBar/>
          <div className='p-4 space-y-6'>
            {feed.map((post)=>{
              return <PostCard key={post._id} post={post}/>
            })}
          </div>
        </div>
        <div className='max-xl:hidden sticky top-0'>
          <RecentMessages/>
        </div>
      </div>
    </div>
  ) : <Loading/>
}

export default Feed

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCardProfile from '../components/PostCardProfile'
import EditProfileModel from '../components/EditProfileModel'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios.js'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value)
  const { getToken } = useAuth()
  const { profileId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const fetchUser = async (profileId) => {
    const token = await getToken({ template: "jwt" })
    try {
      const { data } = await api.post(`/api/user/profiles`, { profileId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setUser(data.profile)
        setPosts(data.posts)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId)
    } else {
      fetchUser(currentUser._id)
    }
  }, [profileId, currentUser])

  return user ? (
    <div className='relative min-h-screen w-full overflow-y-scroll no-scrollbar bg-linear-to-l from-slate-800 to-stone-900 p-6'>
      <div className='max-w-3xl mx-auto'>
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          <div className='h-40 bg-linear-to-r from-pink-400 to-blue-500'>
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=''
                className='w-full h-full object-cover'
              />
            )}
          </div>
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>

        <div className='flex justify-center items-center text-white mt-4'>
          <div className='bg-linear-to-r from-indigo-500 to-purple-600 rounded-md px-6 py-2'>
            <p className='font-medium'>Posts</p>
          </div>
        </div>

        {posts.length > 0 ? (
          <div className='mt-6 grid grid-cols-3 gap-1'>
            {posts.map((post) => (
              <div
                key={post._id}
                className='cursor-pointer relative group'
                onClick={() => setSelectedPost(post)}
              >
                {post.image_urls.length > 0 ? (
                  <img
                    src={post.image_urls[0]}
                    alt=''
                    className='w-full h-40 object-cover'
                  />
                ) : (
                  <div className='w-full h-40 bg-linear-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-medium p-2 text-center rounded-sm'>
                    {post.content.length > 50
                      ? post.content.slice(0, 50) + '...'
                      : post.content}
                  </div>
                )}

                <div className='absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold'>
                  View
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='mt-6 flex items-center justify-center text-white text-lg font-medium h-40'>
            No posts yet
          </div>
        )}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full">
            <PostCardProfile post={selectedPost} onClose={() => setSelectedPost(null)} />
          </div>
        </div>
      )}

      {showEdit && <EditProfileModel setShowEdit={setShowEdit} />}
    </div>
  ) : (<Loading />)
}

export default Profile

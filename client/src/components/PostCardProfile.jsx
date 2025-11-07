import { Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const PostCardProfile = ({ post, onClose }) => {
  const [likes, setLikes] = useState(post.likes_count)
  const currentUser = dummyUserData
  const hashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600">$1</span>'
  )

  const navigate = useNavigate()

  const handleLike = () => {
    if (likes.includes(currentUser._id)) {
      setLikes(likes.filter((id) => id !== currentUser._id))
    } else {
      setLikes([...likes, currentUser._id])
    }
  }

  return (
    <div className="relative bg-linear-to-b from-white to-slate-300 rounded-xl shadow p-4 space-y-10 w-full max-w-3xl mx-auto">
     
      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl font-bold cursor-pointer"
        onClick={onClose}
      >
        ✕
      </button>

   
      <div
        onClick={() => navigate(`/profile/${post.user._id}`)}
        className="inline-flex items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1 text-black">
            <span>{post.user.full_name}</span>
          </div>
          <div className="text-gray-900 text-sm">
            @{post.user.username} | {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      
      {post.content && (
        <div
          className="text-black whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: hashtags }}
        />
      )}

    
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((img, index) => (
          <img
            src={img}
            key={index}
            alt=""
            className={`w-full h-48 object-cover rounded-lg ${
              post.image_urls.length === 1 && 'col-span-2 h-auto'
            }`}
          />
        ))}
      </div>

      
      <div className="flex items-center gap-4 text-black text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1">
          <Heart
            className={`w-7 h-7 cursor-pointer ${
              likes.includes(currentUser._id) &&
              'text-red-500 fill-red-500'
            }`}
            onClick={handleLike}
          />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-7 h-7 cursor-pointer" />
          <span>10</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-7 h-7 cursor-pointer" />
          <span>7</span>
        </div>
      </div>
    </div>
  )
}

export default PostCardProfile
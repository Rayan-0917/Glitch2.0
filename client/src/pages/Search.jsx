import React, { useState, useEffect } from 'react'
import { SearchIcon } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'

const Search = () => {

  const dispatch=useDispatch()
  const [input, setInput]=useState("")
  const [users, setUsers]=useState([])
  const [loading, setLoading]=useState(false)
  const {getToken}=useAuth()


  const handleSearch=async(e)=>{
    if(e.key==='Enter'){
      try {
        setUsers([])
        setLoading(true)
        const {data}=await api.post('/api/user/discover', {input}, {
          headers: {Authorization: `Bearer ${await getToken({template: "jwt"})}`}
        })
        
        data.success ? setUsers(data.users) : toast.error(data.message)
        setLoading(false)
        setInput('')
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
    }
  }

  useEffect(()=>{
    getToken({template: "jwt"}).then((token)=>{
      dispatch(fetchUser(token))
    })
  }, [])

  return (
    <div className='min-h-screen bg-linear-to-l from-slate-800 to-stone-900'> 
        <div className='max-w-6xl mx-auto p-6'>
          <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2 text-white'>Discover</h1>
          </div> 
          <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
            <div className='p-6'>
              <div className='relative'>
                <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
                <input type="text" placeholder='Search' className='pl-10 p-3 w-full border border-gray-800 rounded-md ' onChange={(e)=>setInput(e.target.value)} value={input} onKeyUp={handleSearch}  />
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            {
              users.map((user)=>(
                <UserCard user={user} key={user._id}/>
              ))
            }
          </div>
          {
            loading && (<Loading height='60vh'/>)
          }
        </div>
    </div>
  )
}

export default Search

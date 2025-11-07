import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { SearchIcon } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'

const Search = () => {

  const [input, setInput]=useState("")
  const [users, setUsers]=useState(dummyConnectionsData)
  const [loading, setLoading]=useState(false)


  const handleSearch=async()=>{
    if(e.key==='Enter'){
      setUsers([])
      setLoading(true)
      setTimeout(() => {
        setUsers(dummyConnectionsData)
        setLoading(false)
      }, 1000);
    }
  }

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

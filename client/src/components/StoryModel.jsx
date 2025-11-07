import React, { useState } from 'react'
import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const StoryModel = ({setShowModel, fetchStories}) => {

    const bgColors=['#09c71d', '#eadf11', '#259e92', '#f3d3f1', '#b85717', '#5717b9', '#d7295e']


    const [mode, setMode]=useState("text")
    const [background, setBackground]=useState(bgColors[0])
    const [text, setText]=useState("")
    const [media, setMedia]=useState(null)
    const [previewUrl, setPreviewUrl]=useState(null)
    
    const handleMediaUpload=(e)=>{
        const file=e.target.files?.[0]
        if(file){
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleCreateStory=async()=>{

    }

  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
      <div className='w-full max-w-md'> 
        <div className='text-center mb-4 flex items-center justify-between'>
            <button onClick={()=>setShowModel(false)} className='text-white p-2 cursor-pointer'>
                <ArrowLeft />
            </button>
            <h2 className='text-lg font-semibold'>Create Story</h2>
        </div>
        <div className='rounded-lg h-96 flex items-center justify-center relative' style={{backgroundColor:background}}>
            {mode==='text' && (
                <textarea className='bg-transparent text-white w-full h-full p-6 resize-none focus:outline-none' placeholder="What's on your mind?" onChange={(e)=>setText(e.target.value)} value={text}/>
            )}
            {
                mode==='media' && previewUrl && (
                    media?.type.startsWith('image')?(
                        <img src={previewUrl} alt="" className='object-contain max-h-full' />
                    ):(
                        <video src={previewUrl} className='object-contain max-h-full'/>
                    )
                )
            }
        </div>
        <div className='flex mt-4 gap-2'>
            {bgColors.map((colour)=>(
                <button key={colour} className='w-6 h-6 rounded-full ring cursor-pointer' style={{backgroundColor: colour}} onClick={()=>setBackground(colour)}/>
            ))}
        </div>
        <div className='flex gap-2 mt-4'>
            <button onClick={()=>{setMode('text'); setMedia(null); setPreviewUrl(null)}} className={`flex-1 flex items-center justify-center gap-2 p-2 cursor-pointer rounded ${mode==='text' ?"bg-white text-black":"bg-zinc-800"}`}>
                <TextIcon size={18}/>Text
            </button>
            <label className={`flex-1 flex cursor-pointer items-center justify-center gap-2 p-2 rounded ${mode==='media' ?"bg-white text-black":"bg-zinc-800"}`}>
                <input onChange={(e)=>{handleMediaUpload(e); setMode('media')}} type="file" accept='image/*, video/*' className='hidden' />
                <Upload size={18}/>Photo/Video
            </label>
        </div>
        <button onClick={()=>toast.promise(handleCreateStory(), {
            loading: 'Saving...',
            success: <p>Story Added</p>,
            error: e=><p>{e.message}</p>
        })} className='flex items-center justify-center w-full gap-2 py-2.5 mt-4 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
            <Sparkle size={18}/>Create Story
        </button>
      </div>
    </div>
  )
}

export default StoryModel

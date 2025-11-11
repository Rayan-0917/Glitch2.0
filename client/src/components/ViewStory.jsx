import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const ViewStory = ({viewStory, setViewStory}) => {

    const [progress, setProgress]=useState(0)
    useEffect(()=>{
        let timer, progressInterval;
        if(viewStory && viewStory.media_type!=='video'){
            setProgress(0)
            const duration=10000;
            const stepTime=100;
            let elapsed=0;
            progressInterval=setInterval(() => {
                elapsed+=stepTime
                setProgress((elapsed/duration)*100)
            }, stepTime);
            
            timer=setTimeout(() => {
                setViewStory(null)
            }, duration);
        }

        return ()=>{
            clearTimeout(timer);
            clearInterval(progressInterval);
        }

    }, [viewStory, setViewStory])

    const handleClose=()=>{
        setViewStory(null)
    }


    const handleRenderContent=()=>{
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img src={viewStory.media_url} alt="" className='max-w-full max-h-screen object-contain' />
                )
              
            case 'video':
                return (
                    <video onEnded={()=>setViewStory(null)} src={viewStory.media_url} className='max-h-screen' controls autoPlay ></video>
                )
              
            case 'text':
                return (
                    <div className='w-full h-full flex items-center justify-center text-white text-2xl text-center'>
                        {viewStory.content}
                    </div>
                )
            default:
                return null;
        }
    }

  return (
    <div className='fixed inset-0 z-110 h-screen bg-black bg-opacity-90 flex items-center justify-center p-4' style={{backgroundColor: viewStory.media_type==='text' ? viewStory.background_colour : '#000000'}}>
        <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
            <div className='h-full bg-white transition-all duration-100 linear' style={{width: `${progress}%`}}>

            </div>
        </div>
        <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 '>
            <img src={viewStory.user?.profile_picture} alt={viewStory.user?.usernmae} className='absolute size-8 top-3 left-3 z-10 rounded-full w-15 h-15' />
            <div className='text-white text-xl font-medium flex items-center ml-14 mt-3'>
                <span>{viewStory.user?.username}</span>
            </div>
        </div>
        <button onClick={()=>handleClose()} className='absolute top-7 right-8 text-white'>
            <X className='w-8 h-8 hover:scale-110 transition cursor-pointer'/>
        </button>
        <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
            {handleRenderContent()}
        </div>
    </div>
  )
}

export default ViewStory

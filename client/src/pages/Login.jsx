import React from 'react'
import { assets } from '../assets/assets'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
    return (
        <div className='min-h-screen flex items-center justify-center p-4 relative'> 
            
            <img 
                src={assets.background} 
                alt="" 
                className='absolute inset-0 z-[-1] w-full h-full object-cover' 
            />

            <div className="flex flex-col items-center space-y-6 p-8   rounded-xl max-w-sm w-full ">
                
                <img src={assets.logo} alt="logo" className='w-20 h-20 mb-3 rounded-full'  />
                <h1 className="text-3xl font-bold text-white">Your Social Space</h1>
                <p className="text-gray-400 text-sm">
                    Connect. Share. Discover.
                </p>
                
                <SignIn appearance={{
                    elements: {
                        card: "shadow-none border-none bg-transparent" 
                    }
                }}/>
            </div>
        </div>
    )
}

export default Login
import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({handleVideoCall}) => {
  return (
    <div className='p-3 w-full border-b flex items-center justify-end max-w-7xl mx-auto absolute top-0'>
      <button onClick={handleVideoCall} className='btn btn-sm btn-success text-white'>
        <VideoIcon className='size-6'/>
      </button>
    </div>
  )
}

export default CallButton

import React from 'react'

const NoFriendReq = () => {
  return (
    <div className='card bg-base-200 p-6 text-center'>
      <h3 className='font-semibold mb-1 text-lg'>No Friends Yet</h3>
      <p className='text-base-content opacity-70'>Connect with language partner below to start practicing together!</p>
    </div>
  )
}

export default NoFriendReq;


export const NoRecommendedUsers= () => {
  return (
    <div className='card bg-base-200 text-center p-6 '>
      <h3 className='font-semibold text-lg mb-2'>No Recommended User</h3>
      <p className='text-base-content opacity-70'>Check back later for new language partners!</p>
    </div>
  )
}

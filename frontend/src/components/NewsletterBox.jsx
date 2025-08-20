

import React from 'react'

const NewsletterBox = () => {
  return (
    <div className='text-center'>
      <p className="text-2xl font-medium text-gray-800">Subscribe & Get Your First Listing Free</p>
      <p className="text-gray-400 mt-3">List your first piece free & never miss fresh drops.</p>
      <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-3 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
        <button className="bg-black text-white text-xs px-10 py-4">SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
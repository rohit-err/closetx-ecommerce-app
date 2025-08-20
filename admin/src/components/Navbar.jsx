
import React from 'react'
import { assets } from '../assets/assets'
import useAdminStore from '../store/adminStore'
const Navbar = () => {
  const { adminLogout } = useAdminStore()
  return (
    <div className='flex items-center py-2 px-[4%] justify-between h-16 bg-white'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button onClick={() => { adminLogout() }} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-700 transition-colors'>
        Logout
      </button>
    </div>
  )
}

export default Navbar
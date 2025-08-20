
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <div className='w-[18vw] h-full border-r-2 bg-white overflow-y-auto'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-pink-100 border-pink-300' : 'hover:bg-gray-50'
                        }`
                    }
                    to='/add'
                >
                    <img className='w-5 h-5' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Items</p>
                </NavLink>

                <NavLink
                    className={({ isActive }) =>
                        `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors ${isActive ? 'bg-pink-100 border-pink-300' : 'hover:bg-gray-50'
                        }`
                    }
                    to='/list'
                >
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>

               
            </div>
        </div>
    )
}

export default Sidebar



import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useShopStore from '../store/shopStore';
import { assets } from '../assets/assets';
import { Heart } from 'lucide-react';
import { Navigate } from 'react-router-dom';
const Navbar = () => {
  const { visible, setVisible, setShowSearch, isAuthenticated, showRedDot, setShowRedDot, logout, setOpenWishList, setShowLoginModal2 } = useShopStore()

  const navigate = useNavigate()
  function handleClick() {
    setShowSearch(true)
    navigate('/collection')
  }

  function handleWishClick() {
    if (!isAuthenticated) {
      setOpenWishList(true)
      setShowLoginModal2(true)
    }
    else {
      navigate("/interest")
      if(showRedDot) setShowRedDot(false)
    }

  }
  return (
    <div className='flex items-center justify-between py-5  font-medium'>
      <Link to={'/'}> <img src={assets.logo} className="w-32" alt="" /></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img onClick={() => { handleClick() }} src={assets.search_icon} alt="" className="w-5 cursor-pointer" />
        <div className="group relative">
          <Link to='/login'><img src={assets.profile_icon} alt="" className="w-5 cursor-pointer" /></Link>
          {isAuthenticated && <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <Link to='/my-profile' className="cursor-pointer hover:text-black">My Profile</Link>
              <Link to='/my-listings' className="cursor-pointer hover:text-black">My Listings</Link>
              <Link onClick={() => { logout() }} className="cursor-pointer hover:text-black">Logout</Link>
            </div>
          </div>}
        </div>
        <div onClick={() => { handleWishClick() }} className='relative cursor-pointer'>
          <div className="relative inline-block" title="Interested Items">
            <Heart
              className="w-[30px] h-[33px] text-gray-800"
              strokeWidth={1.2}
            />

            {showRedDot && (
              <span className="absolute top-0 right-0 block w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
            )}
          </div>
        </div>
        <img onClick={setVisible} src={assets.menu_icon} alt="" className="w-5 cursor-pointer sm:hidden" />
      </div>

      <div className={visible ? "absolute top-0 right-0 bottom-0 overflow-hidden fixed-div bg-white transition-all w-full  z-50" : "absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all w-0"}>
        <div className="flex flex-col text-gray-600">
          <div onClick={setVisible} className="flex items-center gap-4 p-3 cursor-pointer">
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={setVisible} className="py-2 pl-6 border" to="/">HOME</NavLink>
          <NavLink onClick={setVisible} className="py-2 pl-6 border" to="/collection">COLLECTION</NavLink>
          <NavLink onClick={setVisible} className="py-2 pl-6 border" to="/about">ABOUT</NavLink>
          <NavLink onClick={setVisible} className="py-2 pl-6 border" to="/contact">CONTACT</NavLink>
        </div>
      </div>
    </div>
  )
};

export default Navbar;


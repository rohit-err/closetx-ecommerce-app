
import React, { useEffect, useState } from "react";
import useShopStore from '../store/shopStore'
import { assets } from '../assets/assets'
import { useLocation } from "react-router-dom";
const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useShopStore()
    const location = useLocation();
    const [vis, setVis] = useState(false)
    function handleClose() {
        setShowSearch(false)
        setSearch('')
    }
    useEffect(() => {
        if (location.pathname.includes('collection') && showSearch) {
            setVis(true)
        }
        else {
            setVis(false)
        }
    }, [location]);
    return showSearch && vis ? (
        <div className={`border-t border-b bg-gray-50 text-center  `}>
            <div className=" inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className=" flex-1 outline-none bg-inherit text-sm "
                ></input>
                <img src={assets.search_icon} alt="" className="w-4" />
            </div>
            <img
                src={assets.cross_icon}
                alt=""
                className="w-3  inline  cursor-pointer"
                onClick={() => { handleClose()}}
            />
        </div>
    ) : null
}

export default SearchBar
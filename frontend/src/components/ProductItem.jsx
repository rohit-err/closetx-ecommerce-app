import React, { useState } from 'react'
import useShopStore from '../store/shopStore'
import { Link, Navigate, replace } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const ProductItem = ({
    id,
    name,
    price,
    img,
    condition,
    size,
    brand,
    status,
    listedAt,
    sellerName,
    userId
}) => {
    const { currency, setShowRedDot, showRedDot, isAuthenticated } = useShopStore()
    const [interested, setInterested] = useState(false)

    const toggleInterest = (e) => {
        e.preventDefault()
        setInterested(prev => (!prev))

        if (!showRedDot) setShowRedDot(true)


    }

    const getDaysListed = (listedDate) => {
        if (!listedDate) return 'Recently'
        const days = Math.floor((new Date() - new Date(listedDate)) / (1000 * 60 * 60 * 24))
        if (days === 0) return 'Today'
        if (days === 1) return '1 day ago'
        if (days < 7) return `${days} days ago`
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`
        return 'Few months ago'
    }

    return (
        <Link className="text-gray-800 cursor-pointer group" to={`/product/${id}`}>
            <div className="overflow-hidden rounded-lg border bg-white hover:shadow-md transition-all duration-300">

                <div className="relative overflow-hidden">
                    <img
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        src={img[0]}
                        alt={name}
                    />

                    {status === 'sold' && (
                        <div className="absolute top-2 left-0 transform -rotate-45 px-2 py-0.5 bg-gray-800/90 text-white text-[9px] font-medium">
                            SOLD
                        </div>
                    )}

                    {status !== 'sold' && (
                        <button
                            onClick={toggleInterest}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
                        >
                            <Heart
                                className="w-5 h-5 text-gray-800"
                                fill={interested ? 'currentColor' : 'none'}
                            />
                        </button>
                    )}

                </div>


                <div className="p-4">
                    {brand && brand !== 'Unknown' && (
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{brand}</p>
                    )}
                    <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{name}</p>

                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900">
                            {currency}{price}
                        </p>
                        {condition && (
                            <span className="text-xs text-gray-500 capitalize">{condition}</span>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        {size && <span>Size: {size}</span>}
                        <span>{getDaysListed(listedAt)}</span>
                    </div>

                    {userId && (
                        <p className="text-xs text-gray-400 truncate">
                            Listed by {sellerName}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProductItem                                   
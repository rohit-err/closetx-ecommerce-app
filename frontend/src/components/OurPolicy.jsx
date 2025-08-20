import React from 'react'
import { ShieldCheck, Leaf, Users } from "lucide-react"

const OurPolicy = () => {
    return (
        <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
            
            <div>
                <ShieldCheck className="w-12 h-12 m-auto mb-5 text-black" />
                <p className="font-semibold">Verified Listings</p>
                <p className='text-gray-400'>Only genuine pre-loved items, checked by our community.</p>
            </div>

            <div>
                <Leaf className="w-12 h-12 m-auto mb-5 text-black" />
                <p className="font-semibold">Eco-Friendly Fashion</p>
                <p className='text-gray-400'>Every purchase saves clothes from landfills.</p>
            </div>

            <div>
                <Users className="w-12 h-12 m-auto mb-5 text-black" />
                <p className="font-semibold">Trusted Community</p>
                <p className='text-gray-400'>Buy & sell safely with verified ClosetX members.</p>
            </div>

        </div>
    )
}

export default OurPolicy

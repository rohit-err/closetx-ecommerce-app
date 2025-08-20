import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useShopStore from '../store/shopStore';
import Title from '../components/Title';
import MyListingCard from '../components/MyListingCard';
import { useNavigate } from "react-router";
import { Plus } from "lucide-react"
const MyListings = () => {
  const {
    user,
    userListings,
    getUserListings,
    refreshUserListings,
    error,
    isLoading,
    listingsLoaded
  } = useShopStore();

  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const loadListings = useCallback(async () => {
    if (!user) return;

    try {
      await getUserListings();
    } catch (err) {
      console.error('Error loading listings:', err);
    }
  }, [user, getUserListings]);

  const forceRefreshListings = useCallback(async () => {
    if (!user) return;

    try {
      await refreshUserListings();
    } catch (err) {
      console.error('Error refreshing listings:', err);
    }
  }, [user, refreshUserListings]);

  useEffect(() => {
    if (user && !listingsLoaded) {
      loadListings();
    }
  }, [user, listingsLoaded, loadListings]);


  const filteredListings = useMemo(() => {
    if (!Array.isArray(userListings)) return [];

    return userListings.filter(listing => {
      return filter === 'all' || listing.status === filter;
    });
  }, [userListings, filter]);


  const filterCounts = useMemo(() => {
    if (!Array.isArray(userListings)) {
      return { all: 0, available: 0, sold: 0 };
    }

    return {
      all: userListings.length,
      available: userListings.filter(l => l.status === 'available').length,
      sold: userListings.filter(l => l.status === 'sold').length
    };
  }, [userListings]);


  const handleAddListing = useCallback(() => {
    navigate('/add-listing');
  }, [navigate]);

  if (!user) {
    return (
      <div className="border-t pt-10">
        <div className="text-center py-16">
          <p className="text-gray-600">Please login to view your listings</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-10">

      <div className="text-center text-3xl py-8">
        <Title text1={'MY'} text2={'LISTINGS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Manage your listed items
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm max-w-4xl mx-auto">
          {error}
        </div>
      )}


      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex gap-2 justify-center">
          {['all', 'available', 'sold'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-sm rounded transition-colors ${filter === type
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type === 'all' && `All (${filterCounts.all})`}
              {type === 'available' && `Active (${filterCounts.available})`}
              {type === 'sold' && `Sold (${filterCounts.sold})`}
            </button>
          ))}
        </div>
      </div>


      <div className="max-w-5xl mx-auto">
        {filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">
              {filter === 'all'
                ? "You haven't created any listings yet."
                : `No ${filter} listings found.`}
            </p>
            <button
              onClick={handleAddListing}
              className="bg-black text-white px-6 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
            >
              ADD NEW LISTING
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <MyListingCard
                key={listing._id}
                id={listing._id}
                name={listing.name}
                price={listing.price}
                img={listing.images || ['/default-product.png']}
                condition={listing.condition}
                size={listing.size}
                brand={listing.brand}
                status={listing.status}
                listedAt={listing.listedAt}
                soldAt={listing.soldAt}
                loadMyListings={forceRefreshListings}

                description={listing.description}
                category={listing.category}
                subCategory={listing.subCategory}
                sizes={listing.sizes}
                contactInfo={listing.contactInfo}
                pickupAddress={listing.pickupAddress}
                updatedAt={listing.updatedAt}
              />
            ))}
          </div>
        )}
      </div>
      {
        userListings.length > 0 && <div className="fixed bottom-20 right-4 z-50 group">

          <button onClick={handleAddListing}
            className="w-14 h-14 bg-black rounded-full flex items-center justify-center 
                   shadow-lg hover:scale-110 transition-transform duration-300 ease-in-out relative"
          >
            <Plus className="w-8 h-8 text-white" />
          </button>


          <span
            className="absolute right-16 top-1/2 -translate-y-1/2
                   bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 
                   group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md"
          >
            ➕ Add New Listing
          </span>
        </div>
      }
    </div>
  );
};

export default MyListings;
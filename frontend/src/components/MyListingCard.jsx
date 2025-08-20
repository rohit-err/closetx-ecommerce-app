
import React, { useState } from 'react'
import {  Eye, Trash2, X, MapPin, Phone, Mail, Calendar, Package, Tag, User, Check } from 'lucide-react'
import useShopStore from '../store/shopStore'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ListingDetailsModal = ({ listing, isOpen, onClose, currency = '₹' }) => {
  if (!isOpen || !listing) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
        {/* Header here */}
        <div className="p-6 border-b relative">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package size={24} className="mr-2" />
            Product Information
          </h1>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>



        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">

              {/* Product Images */}
              <div className="mb-6">
                {listing.images && listing.images.length > 0 ? (
                  <div className={listing.images.length === 1 ? "grid grid-cols-1" : "grid grid-cols-2 gap-3"}>
                    {listing.images.slice(0, 4).map((image, index) => (
                      <div
                        key={index}
                        className={listing.images.length === 1
                          ? "w-full aspect-video bg-gray-100 rounded-lg overflow-hidden"
                          : "aspect-square bg-gray-100 rounded-lg overflow-hidden"}
                      >
                        <img
                          src={image}
                          alt={`${listing.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gray-200 rounded-lg items-center justify-center text-gray-500 text-sm hidden">
                          No Image
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>


              {/* Basic Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                  <p className="text-lg font-semibold text-gray-900">{listing.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                    <p className="text-xl font-bold text-gray-900">{currency}{listing.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border border-black text-black">
                      {listing.status === 'sold' ? 'SOLD' : 'AVAILABLE'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                    <p className="text-gray-900">{listing.category} - {listing.subCategory}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Condition</label>
                    <p className="text-gray-900 capitalize">{listing.condition}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                    <p className="text-gray-900">{listing.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Size</label>
                    <p className="text-gray-900">{listing.size || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <p className="text-gray-900">{listing.description}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Info */}
              {listing.contactInfo && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
                    <Phone className="mr-2" size={20} />
                    Contact Information
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-gray-500" />
                      <span className="text-gray-900">{listing.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <span className="text-gray-900">{listing.contactInfo.email}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Preferred Contact</label>
                      <p className="text-gray-900 capitalize">{listing.contactInfo.preferredContact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pickup Address */}
              {listing.pickupAddress && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
                    <MapPin className="mr-2" size={20} />
                    Pickup Address
                  </h2>

                  <div className="space-y-2 text-gray-900">
                    <p>{listing.pickupAddress.street}</p>
                    <p>{listing.pickupAddress.city}, {listing.pickupAddress.state} - {listing.pickupAddress.zipcode}</p>
                    {listing.pickupAddress.landmark && (
                      <p className="text-sm text-gray-600">Landmark: {listing.pickupAddress.landmark}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Sales Tracking */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
                  <Calendar className="mr-2" size={20} />
                  Sales Tracking
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Listed At</label>
                    <p className="text-gray-900">{formatDate(listing.listedAt || listing.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                    <p className="text-gray-900">{formatDate(listing.updatedAt)}</p>
                  </div>
                  {listing.soldAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Sold At</label>
                      <p className="text-gray-900">{formatDate(listing.soldAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 p-6 bg-gray-50 border-t">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p></p>
            <p>ID: {listing._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};




const MyListingCard = ({
  id,
  name,
  price,
  img,
  condition,
  size,
  brand,
  status,
  listedAt,
  soldAt,
  loadMyListings,
  
  description,
  category,
  subCategory,
  sizes,
  contactInfo,
  pickupAddress,
  updatedAt
}) => {
  const { currency, deleteProduct, handleMarkAsSold ,listProducts} = useShopStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
 
  const getDaysListed = (listedDate) => {
    if (!listedDate) return 'Recently'
    const days = Math.floor((new Date() - new Date(listedDate)) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return 'Few months ago'
  }
  const handleStatusChange = async (e) => {
    e.stopPropagation()
    await handleMarkAsSold(id)
    await loadMyListings();
    listProducts()
  }
  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const res = await deleteProduct(listingId);
        await loadMyListings();
        if (res.success) {
          toast.success('Product deleted successfully')
        }
         listProducts()
      } catch (err) {
        console.log(err);
      }
    }
  };



 
  const fullListing = {
    _id: id,
    name,
    price,
    images: img,
    condition,
    size,
    brand,
    status,
    listedAt,
    soldAt,
    description,
    category,
    subCategory,
    sizes,
    contactInfo,
    pickupAddress,
    updatedAt
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-white hover:shadow-md transition-all duration-300 group relative">
        
        <div className="relative overflow-hidden">
          <img
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            src={img[0]}
            alt={name}
          />

          {status === "sold" ? (
            <div className="absolute top-2 left-0 transform -rotate-45 px-2 py-0.5 bg-gray-800/90 text-white text-[10px] font-medium">
              SOLD
            </div>
          ) : (
            <div
              onClick={handleStatusChange}
              className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 hover:bg-green-500 cursor-pointer transition-colors duration-200 active:scale-110"
              title="Mark as Sold"
            />

          )}
        </div>

      
        <div className="p-4">
          <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{name}</p>

          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-900">
              {currency}{price}
            </p>
            {condition && <span className="text-xs text-gray-500 capitalize">{condition}</span>}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {size && <span>Size: {sizes}</span>}
            <span>{getDaysListed(listedAt)}</span>
          </div>

          
          <div className="flex items-center gap-2 mt-2">
            

            <button
              onClick={() => handleDelete(id)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-full text-red-600 border-red-200 hover:bg-red-50 transition"
            >
              <Trash2 size={14} />
              Delete
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-full text-gray-700 border-gray-300 hover:bg-gray-100 transition"
            >
              <Eye size={14} />
              View
            </button>
          </div>
        </div>
      </div>

      
      <ListingDetailsModal
        listing={fullListing}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currency={currency}
      />
    </>
  )
}

export default MyListingCard

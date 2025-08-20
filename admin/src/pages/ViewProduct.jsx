import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Package } from 'lucide-react'
import useAdminStore from '../store/adminStore'
import { toast } from 'react-toastify'

const ViewProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [seller, setSeller] = useState(null)
  const [buyer, setBuyer] = useState(null)
  const { adminGetProductById, isLoading } = useAdminStore()

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      const res = await adminGetProductById(id)
      setProduct(res.product)
      setSeller(res.seller)
    } catch (error) {
      console.error('Error fetching product details:', error)
      toast.error('Failed to load product details')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/list')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
 
      <div className="mb-6">
        <button
          onClick={() => navigate('/list')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products List
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
            <Package className="mr-2" size={20} />
            Product Information
          </h2>

        
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {product.images && product.images.length > 0 ? (
                product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full bg-gray-200 rounded-lg items-center justify-center text-gray-500 text-sm hidden">
                      No Image
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>
          </div>

          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
              <p className="text-lg font-semibold text-gray-900">{product.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                <p className="text-xl font-bold text-gray-900">₹{product.price}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border border-black text-black">
                  {product.status === 'sold' ? 'SOLD' : 'AVAILABLE'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                <p className="text-gray-900">{product.category} - {product.subCategory}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Condition</label>
                <p className="text-gray-900 capitalize">{product.condition}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                <p className="text-gray-900">{product.brand || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Size</label>
                <p className="text-gray-900">{product.size || 'N/A'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <p className="text-gray-900">{product.description}</p>
            </div>
          </div>
        </div>

    
        <div className="space-y-6">
         
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
              <User className="mr-2" size={20} />
              Seller Information
            </h2>

            {seller ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <p className="text-gray-900">{seller.sellerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-gray-900">{seller.sellerEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                  <p className="text-gray-600 font-mono text-sm">{product.userId}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Seller information not available</p>
            )}
          </div>

          {product.contactInfo && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
                <Phone className="mr-2" size={20} />
                Contact Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-900">{product.contactInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-900">{product.contactInfo.email}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Preferred Contact</label>
                  <p className="text-gray-900 capitalize">{product.contactInfo.preferredContact}</p>
                </div>
              </div>
            </div>
          )}

          {product.pickupAddress && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
                <MapPin className="mr-2" size={20} />
                Pickup Address
              </h2>

              <div className="space-y-2 text-gray-900">
                <p>{product.pickupAddress.street}</p>
                <p>{product.pickupAddress.city}, {product.pickupAddress.state} - {product.pickupAddress.zipcode}</p>
                {product.pickupAddress.landmark && (
                  <p className="text-sm text-gray-600">Landmark: {product.pickupAddress.landmark}</p>
                )}
              </div>
            </div>
          )}

          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold mb-4 flex items-center text-gray-800">
              <Calendar className="mr-2" size={20} />
              Sales Tracking
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Listed At</label>
                <p className="text-gray-900">{formatDate(product.listedAt || product.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                <p className="text-gray-900">{formatDate(product.updatedAt)}</p>
              </div>
              {product.soldAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Sold At</label>
                  <p className="text-gray-900">{formatDate(product.soldAt)}</p>
                </div>
              )}
              {buyer && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Sold To</label>
                  <p className="text-gray-900">{buyer.name} ({buyer.email})</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProduct

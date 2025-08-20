
import React, { useState } from 'react'
import { X, Eye } from 'lucide-react'
import useAdminStore from '../store/adminStore'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const List = () => {
  const [products, setProducts] = useState([])
  const { listProducts, deleteProduct, isLoading } = useAdminStore()
  const navigate = useNavigate()
  const fetchProducts = async () => {
    try {
      const res = await listProducts()
      setProducts(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }



  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listed products...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">

      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">All Products List</h1>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-lg border bg-white hover:shadow-md transition-all duration-300 group relative"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.images && product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />

                {product.status === 'sold' && (
                  <div className="absolute top-2 left-0 transform -rotate-45 px-2 py-0.5 bg-gray-800/90 text-white text-[9px] font-medium">
                    SOLD
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{product.category}</span>
                  <span className="text-sm font-semibold text-gray-900">₹{product.price}</span>
                </div>


                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleProductClick(product._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-full text-blue-600 border-blue-200 hover:bg-blue-50 transition"
                  >
                    <Eye size={14} />
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-full text-red-600 border-red-200 hover:bg-red-50 transition"
                  >
                    <X size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>


          ))}
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6L14 8H10l-2 5H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500">Get started by adding your first product.</p>
        </div>
      )}
    </div>
  )
}

export default List
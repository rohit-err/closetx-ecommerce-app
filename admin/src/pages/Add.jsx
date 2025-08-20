
import React, { useState } from 'react'
import useAdminStore from '../store/adminStore'
import { Loader } from 'lucide-react'
import { toast } from 'react-toastify'
const Add = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    subCategory: '',
    size: '',
    brand: ''
  })

  const [images, setImages] = useState([])

  const conditions = ['new', 'like new', 'good', 'fair', 'poor']
  const categories = ['Men', 'Women', 'Kids']
  const subCategories = ['Topwear', 'Bottomwear', 'Winterwear', 'Footwear', 'Accessories']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const { addProduct, isLoading } = useAdminStore()
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const isFormValid = formData.name && formData.description && formData.price &&
    formData.condition && formData.category && formData.subCategory &&
    images.length > 0

  const handleSubmit = async () => {
    const status = 'available'


    const submitData = new FormData()


    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key])
    })

    images.forEach((image, index) => {
      submitData.append(`image${index + 1}`, image)
    })
    submitData.append('status', status)

    try {
      const res = await addProduct(submitData)
     

      if (res.success) {
        toast.success('Product added successfully')
       
        setFormData({
          name: '', description: '', price: '', condition: '',
          category: '', subCategory: '', size: '', brand: ''
        })
        setImages([])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error adding product')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Item</h1>
        <p className="text-gray-600 text-sm">
          Add new clothing items to your inventory
        </p>
      </div>

      <div className="max-w-4xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images * (Max 5)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="text-gray-500">
                <span className="text-2xl mb-2 block">📸</span>
                <p className="text-sm">Click to upload images</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
              </div>
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-3">
                {images.length} image{images.length > 1 ? 's' : ''} selected
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-gray-100 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-600 mb-1">
                        {file.name.length > 12
                          ? file.name.substring(0, 9) + '...' + file.name.split('.').pop()
                          : file.name
                        }
                      </div>
                      <div className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Blue Denim Jacket"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="e.g. Nike, Zara, H&M"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Describe the item, material, features, any defects..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none"
          />
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="">Select Type</option>
              {subCategories.map(subCat => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="">Select Size</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {conditions.map(cond => (
              <label key={cond} className="flex items-center cursor-pointer bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={formData.condition === cond}
                  onChange={handleInputChange}
                  className="mr-2 text-black focus:ring-black"
                />
                <span className="text-sm capitalize font-medium">{cond}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter selling price"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              min="0"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="flex-1 bg-black text-white py-3 px-6 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader className="animate-spin text-white" size={18} />
            ) : (
              "PAY & ADD"
            )}
          </button>
        </div>


        {!isFormValid && (
          <div className="text-center text-sm text-gray-500">
            Please fill all required fields and upload at least one image to add the item
          </div>
        )}
      </div>
    </div>
  )
}

export default Add
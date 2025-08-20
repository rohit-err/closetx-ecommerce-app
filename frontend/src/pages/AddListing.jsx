import React, { useState } from 'react'
import Title from '../components/Title'
import { Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import useShopStore from '../store/shopStore'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
const AddListing = () => {
  const { addProduct, isLoading, listProducts, currency, createRazorpayOrder, verifyRazorpayPayment, user } = useShopStore()
  const [paymentLoading, setPaymentLoading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    subCategory: '',
    size: '',
    brand: '',
    contactInfo: {
      phone: '',
      email: '',
      preferredContact: 'both'
    },
    pickupAddress: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      landmark: ''
    }
  })

  const [images, setImages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const conditions = ['new', 'like new', 'good', 'fair', 'poor']
  const categories = ['Men', 'Women', 'Kids']
  const subCategories = ['Topwear', 'Bottomwear', 'Winterwear', 'Footwear', 'Accessories']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const contactMethods = ['phone', 'email', 'both']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 4) {
      alert('Maximum 4 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const isFormValid = formData.name && formData.description && formData.price &&
    formData.condition && formData.category && formData.subCategory &&

    formData.contactInfo.phone && formData.contactInfo.email &&
    formData.pickupAddress.street && formData.pickupAddress.city &&
    formData.pickupAddress.state && formData.pickupAddress.zipcode &&
    images.length > 0

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true); 
  };
  const submitProduct = async () => {
    try {
      const submitData = new FormData()

      // Basic fields
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price)
      submitData.append('condition', formData.condition)
      submitData.append('category', formData.category)
      submitData.append('subCategory', formData.subCategory)
      submitData.append('size', formData.size)
      submitData.append('brand', formData.brand)
      submitData.append('status', 'available')

      // Contact info
      submitData.append('contactInfo.phone', formData.contactInfo.phone)
      submitData.append('contactInfo.email', formData.contactInfo.email)
      submitData.append('contactInfo.preferredContact', formData.contactInfo.preferredContact)

      // Pickup address
      submitData.append('pickupAddress.street', formData.pickupAddress.street)
      submitData.append('pickupAddress.city', formData.pickupAddress.city)
      submitData.append('pickupAddress.state', formData.pickupAddress.state)
      submitData.append('pickupAddress.zipcode', formData.pickupAddress.zipcode)
      submitData.append('pickupAddress.landmark', formData.pickupAddress.landmark)

      // Images
      images.forEach((image, index) => {
        submitData.append(`image${index + 1}`, image)
      })

      const res = await addProduct(submitData)

      if (res.success) {
        toast.success('Product listed successfully! Your item is now live')
        setFormData({
          name: '', description: '', price: '', condition: '', category: '',
          subCategory: '', size: '', brand: '',
          contactInfo: { phone: '', email: '', preferredContact: 'both' },
          pickupAddress: { street: '', city: '', state: '', zipcode: '', landmark: '' }
        })
        setImages([])
        setIsModalOpen(false)
        setPaymentLoading(false)

        navigate('/my-listings')
        listProducts()
      }
    } catch (error) {
      console.error('Error submitting product:', error)
      toast.error('Error listing product. Please try again')
      setPaymentLoading(false)
      setIsModalOpen(false)
    }
  }


  const handlePayment = async () => {
    setPaymentLoading(true)

    try {
      if (paymentMethod === "razorpay") {
        
        const orderData = await createRazorpayOrder() 

        const options = {
          key: orderData.keyId,
          amount: orderData.orderAmount,
          currency: "INR",
          name: "ClosetX",
          description: "Listing Fee Payment",
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }

              const verifyResult = await verifyRazorpayPayment(verificationData)

              if (verifyResult.success) {
                
                await submitProduct()
              } else {
                setPaymentLoading(false)
                toast.error("Payment verification failed")
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              setPaymentLoading(false) 
              toast.error("Payment verification failed")
            }
          },
          prefill: {
            name: user.name,
            email: formData.contactInfo.email,
            contact: formData.contactInfo.phone
          },
          theme: {
            color: "#000000"
          },
          modal: {
            ondismiss: function () {
              setPaymentLoading(false)
              toast.info("Payment cancelled")
            }
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()

      } else if (paymentMethod === "stripe") {
        setPaymentLoading(false)
        toast.error("Stripe payment is currently unavailable. Please use Razorpay")
        return

      }

    } catch (error) {
      console.error('Payment error:', error)
      toast.error("Payment failed. Please try again")
      setPaymentLoading(false)
    }
  }

  return (
    <div className="border-t pt-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'ADD NEW'} text2={'LISTING'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          List your pre-loved clothing for others to buy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images * (Max 4)
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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

        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Describe the item, why you're selling, any defects..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black resize-none"
            required
          />
        </div>

        {/* Category & SubCategory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              
            >
              <option value="">Select Size</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {conditions.map(cond => (
              <label key={cond} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={formData.condition === cond}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                <span className="text-sm capitalize">{cond}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Your asking price"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            min="0"
            required
          />
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                placeholder="Your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                placeholder="Your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method
            </label>
            <div className="flex gap-4">
              {contactMethods.map(method => (
                <label key={method} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    checked={formData.contactInfo.preferredContact === method}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'preferredContact', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Pickup Address */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Pickup Address</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.pickupAddress.street}
              onChange={(e) => handleNestedInputChange('pickupAddress', 'street', e.target.value)}
              placeholder="House/Flat number, Street name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.pickupAddress.city}
                onChange={(e) => handleNestedInputChange('pickupAddress', 'city', e.target.value)}
                placeholder="City name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.pickupAddress.state}
                onChange={(e) => handleNestedInputChange('pickupAddress', 'state', e.target.value)}
                placeholder="State name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.pickupAddress.zipcode}
                onChange={(e) => handleNestedInputChange('pickupAddress', 'zipcode', e.target.value)}
                placeholder="Postal/ZIP code"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={formData.pickupAddress.landmark}
                onChange={(e) => handleNestedInputChange('pickupAddress', 'landmark', e.target.value)}
                placeholder="Nearby landmark"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            type="submit"
            name="action"
            value="publish"
            disabled={!isFormValid || isLoading}
            className="flex-1 bg-black text-white py-3 px-6 text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader className="animate-spin text-white" size={18} />
            ) : (
              "PAY & ADD"
            )}
          </button>
        </div>


        {/* Form Validation Message */}
        {!isFormValid && (
          <div className="text-center text-sm text-gray-500 mb-4">
            Please fill all required fields and upload at least one image to publish
          </div>
        )}
      </form>
      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded border border-gray-300 p-6 w-full max-w-md mx-4">
            {/* Header */}
            <div className="text-center mb-6">
              <Title text1={'LISTING FEE'} text2={'PAYMENT'} />
              <p className="text-gray-600 text-xs sm:text-sm mt-2">Complete payment to publish your listing</p>
            </div>

            {/* Fee Display */}
            <div className="border border-gray-300 rounded p-4 mb-6 text-center">
              <p className="text-gray-600 text-xs mb-1">One-time listing fee</p>
              <p className="text-2xl font-medium text-gray-800">{currency}49</p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Stripe */}
                <div
                  onClick={() => setPaymentMethod("stripe")}
                  className={`cursor-pointer border p-3 h-16 flex items-center justify-center transition-colors
              ${paymentMethod === "stripe"
                      ? "border-black"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  <img
                    src={assets.stripe_logo}
                    alt="Stripe"
                    className="h-6 object-contain"
                  />
                </div>

                {/* Razorpay */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`cursor-pointer border p-3 h-16 flex items-center justify-center transition-colors
              ${paymentMethod === "razorpay"
                      ? "border-black"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  <img
                    src={assets.razorpay_logo}
                    alt="Razorpay"
                    className="h-6 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 text-sm hover:bg-gray-200 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handlePayment}
                disabled={isLoading || paymentLoading}
                className="flex-1 bg-black text-white py-3 px-6 text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading || paymentLoading ? (
                  <Loader className="animate-spin text-white" size={18} />
                ) : (
                  "PROCEED TO PAY"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AddListing
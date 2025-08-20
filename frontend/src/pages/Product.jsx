import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShopStore from '../store/shopStore';
import RelatedProducts from '../components/RelatedProducts';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import Login from "./Login";  
import Modal from "../components/Modal";
const Product = () => {
  const { productId } = useParams();
  const { products, currency, getProductById, isAuthenticated, showContactModal, setShowContactModal, showLoginModal, setShowLoginModal, isLoading } = useShopStore();

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneForWhatsApp = (phone) => {

    const cleanPhone = phone.replace(/\D/g, '');


    if (cleanPhone.length === 10) {
      return `91${cleanPhone}`;
    }
    return cleanPhone;
  };

  const getSellerName = () => {
    return productData?.userId?.name || 'there';
  };

  const handleShowContactModal = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
    }
    else {
      setShowContactModal(true)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {

        setError(null);
        const data = await getProductById(productId);
        if (!data) {
          setError('Product not found');
          return;
        }
        setProductData(data);
        setImage(data?.images?.[0] || '');
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, products, getProductById]);


  const getDaysListed = (listedDate) => {
    if (!listedDate) return 'Recently listed';
    try {
      const days = Math.floor((new Date() - new Date(listedDate)) / (1000 * 60 * 60 * 24));
      if (days === 0) return 'Listed today';
      if (days === 1) return 'Listed 1 day ago';
      if (days < 7) return `Listed ${days} days ago`;
      if (days < 30) return `Listed ${Math.floor(days / 7)} weeks ago`;
      return 'Listed few months ago';
    } catch (error) {
      return 'Recently listed';
    }
  };


  const handleWhatsApp = () => {
    const phone = productData?.contactInfo?.phone;
    if (!phone) {
      alert('Phone number not available');
      return;
    }

    try {
      const formattedPhone = formatPhoneForWhatsApp(phone);
      const sellerName = getSellerName();
      const message = `Hi ${sellerName}, I'm interested in your "${productData.name}" listed for ${currency}${productData.price}. Is it still available?`;

      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
      setShowContactModal(false);
    } catch (error) {
      alert('Failed to open WhatsApp');
      console.error('WhatsApp error:', error);
    }
  };

  const handleEmail = () => {
    const email = productData?.contactInfo?.email;

    if (!email) {
      alert('Email not available');
      return;
    }

    if (!validateEmail(email)) {
      alert('Invalid email address');
      return;
    }

    try {
      const sellerName = getSellerName();
      const subject = `Interested in ${productData.name}`;
      const body = `Hi ${sellerName},\n\nI saw your listing for "${productData.name}" priced at ${currency}${productData.price}.\n\nIs this item still available? I'd love to know more details.\n\nThanks!`;

      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      setShowContactModal(false);
    } catch (error) {
      alert('Failed to open email client');
      console.error('Email error:', error);
    }
  };

  const handleCall = () => {
    const phone = productData?.contactInfo?.phone;
    if (!phone) {
      alert('Phone number not available');
      return;
    }

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        alert('Invalid phone number');
        return;
      }

      window.location.href = `tel:${cleanPhone}`;
      setShowContactModal(false);
    } catch (error) {
      alert('Failed to initiate call');
      console.error('Call error:', error);
    }
  };


  const handleImageSelect = (imgSrc) => {
    if (imgSrc) {
      setImage(imgSrc);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }


  if (error) return <div className="border-t pt-10 text-center text-red-500">{error}</div>;


  if (!productData) return <div className="opacity-0"></div>;


  const hasContactInfo = productData?.contactInfo?.phone || productData?.contactInfo?.email;

  return (
    <div className="border-t pt-10">
      <div className="flex flex-col sm:flex-row gap-12">

        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full">
            {productData.images?.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`product view ${index + 1}`}
                onClick={() => handleImageSelect(imgSrc)}
                className="cursor-pointer w-[24%] sm:w-full sm:mb-3 flex-shrink-0 hover:opacity-75"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%] relative overflow-hidden">
            <img
              src={image}
              alt="product main view"
              className="w-full h-auto border"
              onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
            />

            {productData.status === 'sold' && (
              <div className="absolute top-2 left-0 transform -rotate-45 px-2 py-0.5 bg-gray-800/90 text-white text-[9px] font-medium">
                SOLD
              </div>
            )}
          </div>


        </div>


        <div className="flex-1">
          {productData.brand && productData.brand !== 'Unknown' && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {productData.brand}
            </p>
          )}

          <h1 className="font-semibold text-2xl">{productData.name}</h1>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {productData.category && productData.subCategory && (
              <span className="text-xs text-gray-600 border rounded-full px-3 py-1">
                {productData.category}'s {productData.subCategory}
              </span>
            )}
            {productData.condition && (
              <span className="text-xs text-gray-600 border rounded-full px-3 py-1 capitalize">
                {productData.condition}
              </span>
            )}
          </div>

          <p className="mt-4 text-3xl font-semibold">
            {currency}{productData.price}
          </p>

          <div className="mt-2 text-sm text-gray-500 space-y-1">
            {productData.status === 'sold' ? (
              <>
                {productData.soldAt && (
                  <p>Sold on {new Date(productData.soldAt).toLocaleDateString()}</p>
                )}

              </>
            ) : (
              <>

                {productData.listedAt && <p>Listed on {new Date(productData.listedAt).toLocaleDateString()}</p>}
                {getSellerName() && getSellerName() !== 'there' && (
                  <p>
                    Listed by <span className="font-medium text-gray-800">{getSellerName()}</span>
                  </p>
                )}
              </>
            )}
          </div>

          {productData.sizes?.length > 0 && (
            <p className="mt-4 text-sm text-gray-600">
              {productData.sizes.length === 1
                ? `Size: ${productData.sizes[0]}`
                : `Sizes: ${productData.sizes.join(', ')}`}
            </p>
          )}

          <p className="mt-4 text-gray-600">{productData.description}</p>


          {productData.status !== 'sold' ? (
            <div className="mt-6">
              <button
                onClick={handleShowContactModal}  
                disabled={!hasContactInfo}
                className={`py-3 px-6 text-sm ${!hasContactInfo
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                {!hasContactInfo ? 'CONTACT INFO UNAVAILABLE' : 'CONTACT SELLER'}
              </button>
            </div>
          ) : (
            <div className="mt-6 border border-gray-300 text-gray-700 py-3 px-6 text-sm">
              This item has been sold
            </div>
          )}

          {productData.pickupAddress && productData.status !== 'sold' && (
            <div className="mt-4 border rounded p-4 text-sm">
              <h3 className="font-medium mb-1">📍 Pickup Location</h3>
              <p>{productData.pickupAddress.street}</p>
              <p>
                {productData.pickupAddress.city}, {productData.pickupAddress.state} {productData.pickupAddress.zipcode}
              </p>
              {productData.pickupAddress.landmark && (
                <p className="text-xs text-gray-500 mt-1">Near: {productData.pickupAddress.landmark}</p>
              )}
            </div>
          )}
        </div>
      </div>


      <Modal

      >
        <Login />
      </Modal>


      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Contact via</h2>
            <div className="flex flex-wrap gap-3 mb-4 justify-center">
              {productData?.contactInfo?.phone && (
                <>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 min-w-[110px] flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button
                    onClick={handleCall}
                    className="flex-1 min-w-[110px] flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                  >
                    <FaPhone /> Call
                  </button>
                </>
              )}
              {productData?.contactInfo?.email && (
                <button
                  onClick={handleEmail}
                  className="flex-1 min-w-[110px] flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  <FaEnvelope /> Email
                </button>
              )}
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-16">
        <div className="flex">
          <b className="px-5 py-3 text-sm border">Item Description</b>
        </div>
        <div className="border px-6 py-6 text-sm text-gray-600 space-y-2">
          <p>{productData.description}</p>
          {productData.condition && (
            <p className="font-medium text-gray-800">
              Condition: <span className="capitalize">{productData.condition}</span>
            </p>
          )}
        </div>
      </div>


      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;

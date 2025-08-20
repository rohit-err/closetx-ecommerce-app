import React, { useEffect, useState } from 'react';
import useShopStore from '../store/shopStore';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUserProfile } = useShopStore();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
    },
    profileImage: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipcode: user.address?.zipcode || '',
          country: user.address?.country || ''
        },
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.email.trim()) throw new Error('Email is required');

      const res = await updateUserProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipcode: user.address?.zipcode || '',
          country: user.address?.country || ''
        },
        profileImage: user.profileImage || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };


  const getMemberSince = () => {
    if (!user?.joinedAt) return 'Recently joined';
    try {
      return new Date(user.joinedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Recently joined';
    }
  };

  if (!user) return <div className="border-t pt-10 text-center">Please login to view profile</div>;

  return (
    <div className="border-t pt-10">
      <div className="flex flex-col sm:flex-row gap-12">

        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6">
            <img
              src={formData.profileImage || '/default-avatar.png'}
              alt="Profile"
              className="w-full h-full object-cover rounded-full "
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />


            <div
              className={`absolute top-2 right-2 px-3 py-0.5 text-xs font-semibold rounded-full uppercase ${user.role === 'admin' ? 'bg-black text-white' : 'bg-gray-600 text-white'
                }`}
            >
              {user.role || 'USER'}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">Member since {getMemberSince()}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-semibold text-2xl flex items-center gap-2 text-gray-800">
              <FaUser /> My Profile
            </h1>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-black text-white py-2 px-4 text-sm hover:bg-gray-800 flex items-center gap-2 rounded"
              >
                <FaEdit /> EDIT PROFILE
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-black text-white py-2 px-4 text-sm hover:bg-gray-800 flex items-center gap-2 rounded disabled:opacity-50"
                >
                  <FaSave /> {saving ? 'SAVING...' : 'SAVE'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 py-2 px-4 text-sm hover:bg-gray-300 flex items-center gap-2 rounded"
                >
                  <FaTimes /> CANCEL
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-8">

            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">Basic Information</h3>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-gray-600">{user.name}</p>
                  )}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-gray-600">{user.email}</p>
                  )}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-600">{user.phone || <span className="italic text-gray-400">Not provided</span>}</p>
                  )}
                </div>


                <div>

                  {isEditing ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                      <input
                        type="text"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter image URL"
                      />
                    </>
                  ) : (!user.profileImage ?
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                      <p className="text-gray-600">{user.profileImage || <span className="italic text-gray-400">Not provided</span>}</p>
                    </> : null
                  )}
                </div>
              </div>
            </div>


            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">Address</h3>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter street address"
                    />
                  ) : (
                    <p className="text-gray-600">{user.address?.street || <span className="italic text-gray-400">Not provided</span>}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter city"
                      />
                    ) : (
                      <p className="text-gray-600">{user.address?.city || <span className="italic text-gray-400">Not provided</span>}</p>
                    )}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter state"
                      />
                    ) : (
                      <p className="text-gray-600">{user.address?.state || <span className="italic text-gray-400">Not provided</span>}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.zipcode"
                        value={formData.address.zipcode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter zip code"
                      />
                    ) : (
                      <p className="text-gray-600">{user.address?.zipcode || <span className="italic text-gray-400">Not provided</span>}</p>
                    )}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Enter country"
                      />
                    ) : (
                      <p className="text-gray-600">{user.address?.country || <span className="italic text-gray-400">Not provided</span>}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
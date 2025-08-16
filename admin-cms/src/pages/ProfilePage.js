import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import useUserStore from '../stores/userStore';

const ProfilePage = () => {
  const { t } = useTranslation();
  const {
    currentUser,
    loading,
    fetchProfile,
    updateProfile,
    clearError
  } = useUserStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    // Clear error when component unmounts
    return () => clearError();
  }, [clearError]);

  const fetchProfileData = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to load profile');
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Profile not found</h3>
        <p className="mt-1 text-sm text-gray-500">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.profile')}</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  currentUser.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentUser.role === 'admin' ? 'Admin' : 'User'}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  currentUser.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentUser.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="px-6 py-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{currentUser.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.email')}
                  </label>
                  <p className="text-sm text-gray-900">{currentUser.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.phone')}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{currentUser.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.role')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {currentUser.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.createdAt')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(currentUser.createdAt).toLocaleDateString()} {new Date(currentUser.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.updatedAt')}
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(currentUser.updatedAt).toLocaleDateString()} {new Date(currentUser.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saveLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('common.saving')}
                      </div>
                    ) : (
                      t('common.save')
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {t('common.edit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

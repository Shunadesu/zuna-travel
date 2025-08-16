import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import useUserStore from '../../stores/userStore';

const UserFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    currentUser,
    loading,
    fetchUser,
    createUser,
    updateUser,
    clearError
  } = useUserStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchUserData();
    }
  }, [id]);

  useEffect(() => {
    // Clear error when component unmounts
    return () => clearError();
  }, [clearError]);

  const fetchUserData = async () => {
    try {
      setInitialLoading(true);
      const user = await fetchUser(id);
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load user');
      navigate('/admin/users');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check password if creating new user
    if (!isEditing) {
      if (!passwordData.password) {
        toast.error('Password is required');
        return;
      }
      if (passwordData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (passwordData.password !== passwordData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    try {
      const submitData = { ...formData };
      
      if (!isEditing) {
        submitData.password = passwordData.password;
      }

      if (isEditing) {
        await updateUser(id, submitData);
        toast.success('User updated successfully');
      } else {
        await createUser(submitData);
        toast.success('User created successfully');
      }
      
      navigate('/admin/users');
    } catch (error) {
      toast.error(error.message || 'Failed to save user');
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          {t('common.backToUsers')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEditing ? t('users.editTitle') : t('users.createTitle')}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('users.basicInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('users.namePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('users.emailPlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('users.phonePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.role')}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">{t('users.roles.user')}</option>
                  <option value="admin">{t('users.roles.admin')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Section (only for new users) */}
          {!isEditing && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('users.password')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.password')} *
                  </label>
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => handlePasswordChange('password', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('users.passwordPlaceholder')}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('users.passwordMinLength')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.confirmPassword')} *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('users.confirmPasswordPlaceholder')}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('users.status')}
            </h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                {t('users.active')}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('users.activeDescription')}
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/admin/users"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.saving')}
                </div>
              ) : (
                isEditing ? t('common.update') : t('common.create')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;

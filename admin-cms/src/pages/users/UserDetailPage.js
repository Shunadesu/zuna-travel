import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, PencilIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import useUserStore from '../../stores/userStore';

const UserDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  
  const {
    currentUser,
    loading,
    fetchUser,
    clearError
  } = useUserStore();

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    // Clear error when component unmounts
    return () => clearError();
  }, [clearError]);

  const fetchUserData = async () => {
    try {
      await fetchUser(id);
    } catch (error) {
      toast.error(error.message || 'Failed to load user');
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return t('users.roles.admin');
      case 'user':
        return t('users.roles.user');
      default:
        return role;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">{t('users.notFound')}</h3>
        <p className="mt-1 text-sm text-gray-500">{t('users.notFoundDescription')}</p>
        <div className="mt-6">
          <Link
            to="/admin/users"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {t('common.backToUsers')}
          </Link>
        </div>
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
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-2xl font-bold text-gray-900">{t('users.details')}</h1>
          <Link
            to={`/admin/users/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            {t('users.edit')}
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* User Header */}
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(currentUser.role)}`}>
                  {getRoleLabel(currentUser.role)}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  currentUser.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentUser.isActive ? t('users.status.active') : t('users.status.inactive')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('users.basicInfo')}</h3>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.name')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentUser.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.email')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentUser.email}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.phone')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {currentUser.phone || t('users.noPhone')}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.role')}</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('users.accountInfo')}</h3>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.status')}</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      currentUser.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentUser.isActive ? t('users.status.active') : t('users.status.inactive')}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.createdAt')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(currentUser.createdAt).toLocaleDateString()} {new Date(currentUser.createdAt).toLocaleTimeString()}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.updatedAt')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(currentUser.updatedAt).toLocaleDateString()} {new Date(currentUser.updatedAt).toLocaleTimeString()}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('users.userId')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{currentUser._id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhotoIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('vietnam-tours');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('categories.deleteConfirm'))) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axios.delete(`/api/categories/${id}`);
      toast.success(t('categories.deleteSuccess'));
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/categories/${id}`, {
        isActive: !currentStatus
      });
      toast.success(currentStatus ? 'Category deactivated' : 'Category activated');
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Failed to update category status');
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
        <Link
          to="/admin/categories/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Category
        </Link>
      </div>

      {/* Type Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('vietnam-tours')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vietnam-tours'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vietnam Tours
            </button>
            <button
              onClick={() => setActiveTab('transfer-services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transfer-services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transfer Services
            </button>
          </nav>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mb-4">No categories found for {activeTab === 'vietnam-tours' ? 'Vietnam Tours' : 'Transfer Services'}</p>
            <Link
              to="/admin/categories/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Category
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCategories.map((category) => (
              <div key={category._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* Category Image */}
                  <div className="mb-4">
                    {category.images && category.images.length > 0 ? (
                      <img
                        className="w-full h-32 object-cover rounded-lg"
                        src={category.images[0].url}
                        alt={category.name.en}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                                     {/* Category Info */}
                   <div className="mb-4">
                     <Link
                       to={`/admin/categories/${category._id}`}
                       className="block hover:text-blue-600 transition-colors"
                     >
                       <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600">
                         {category.name.en}
                       </h3>
                     </Link>
                     <p className="text-sm text-gray-600 mb-2">
                       {category.name.vi}
                     </p>
                     <p className="text-sm text-gray-500 line-clamp-2">
                       {category.description?.en || 'No description available'}
                     </p>
                   </div>

                  {/* Location Info */}
                  {category.location && (
                    <div className="mb-4 flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {category.location.en}
                    </div>
                  )}

                  {/* Status */}
                  <div className="mb-4">
                    <button
                      onClick={() => handleToggleStatus(category._id, category.isActive)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {category.isActive ? t('common.active') : t('common.inactive')}
                    </button>
                  </div>

                                     {/* Actions */}
                   <div className="flex justify-between items-center">
                     <div className="flex space-x-2">
                       <Link
                         to={`/admin/categories/${category._id}`}
                         className="text-blue-600 hover:text-blue-900 p-1"
                         title="View Details"
                       >
                         <EyeIcon className="h-4 w-4" />
                       </Link>
                       <Link
                         to={`/admin/categories/${category._id}/edit`}
                         className="text-indigo-600 hover:text-indigo-900 p-1"
                         title="Edit Category"
                       >
                         <PencilIcon className="h-4 w-4" />
                       </Link>
                     </div>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={deleteLoading === category._id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                    >
                      {deleteLoading === category._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

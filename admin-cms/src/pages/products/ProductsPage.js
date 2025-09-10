import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhotoIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useTourStore, useTransferStore, useTourCategoryStore, useTransferCategoryStore } from '../../stores';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const { t } = useTranslation();
  const { tours, fetchTours, deleteTour, loading: toursLoading } = useTourStore();
  const { transfers, fetchTransfers, deleteTransfer, loading: transfersLoading } = useTransferStore();
  const { categories: tourCategories, fetchCategories: fetchTourCategories } = useTourCategoryStore();
  const { categories: transferCategories, fetchCategories: fetchTransferCategories } = useTransferCategoryStore();
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFeatured, setSelectedFeatured] = useState('');
  const [activeTab, setActiveTab] = useState('vietnam-tours'); // 'vietnam-tours' or 'transfer-services'

  const loading = toursLoading || transfersLoading;

  // Get current categories based on active tab
  const categories = activeTab === 'vietnam-tours' ? tourCategories : transferCategories;

  useEffect(() => {
    fetchTours();
    fetchTransfers();
    fetchTourCategories();
    fetchTransferCategories();
  }, [fetchTours, fetchTransfers, fetchTourCategories, fetchTransferCategories]);

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      if (type === 'vietnam-tours') {
        await deleteTour(id);
      } else {
        await deleteTransfer(id);
      }
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatPrice = (price, currency = 'USD') => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getCategoryTypeLabel = (type) => {
    switch (type) {
      case 'vietnam-tours':
        return 'Vietnam Tours';
      case 'transfer-services':
        return 'Transfer Services';
      default:
        return type;
    }
  };

  // Get current products based on active tab
  const currentProducts = activeTab === 'vietnam-tours' ? tours : transfers;

  // Filter products by tab and other criteria
  const filteredProducts = (currentProducts || []).filter(product => {
    const matchesSearch = product.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.title?.vi?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category?.slug === selectedCategory;
    
    const matchesStatus = selectedStatus === '' || 
                         (selectedStatus === 'active' && product.isActive) ||
                         (selectedStatus === 'inactive' && !product.isActive);
    
    const matchesFeatured = selectedFeatured === '' ||
                           (selectedFeatured === 'featured' && product.isFeatured) ||
                           (selectedFeatured === 'not-featured' && !product.isFeatured);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <div className="flex space-x-2">
          <Link
            to="/admin/products/create/vietnam-tours"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Tour
          </Link>
          <Link
            to="/admin/products/create/transfer-services"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Transfer
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => {
                setActiveTab('vietnam-tours');
                setSelectedCategory(''); // Reset category filter when switching tabs
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vietnam-tours'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vietnam Tours
            </button>
            <button
              onClick={() => {
                setActiveTab('transfer-services');
                setSelectedCategory(''); // Reset category filter when switching tabs
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
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

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {(categories || [])
                .map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name.en}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Products</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {currentProducts.length} {activeTab === 'vietnam-tours' ? 'tours' : 'transfers'}
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mb-4">
              No {activeTab === 'vietnam-tours' ? 'tours' : 'transfers'} found
            </p>
            <Link
              to={`/admin/products/create/${activeTab}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create First {activeTab === 'vietnam-tours' ? 'Tour' : 'Transfer'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* Product Image */}
                  <div className="mb-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        className="w-full h-48 object-cover rounded-lg"
                        src={product.images[0].url}
                        alt={product.title.en}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.title.en}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.title.vi}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {product.description?.en || 'No description available'}
                    </p>
                  </div>

                  {/* Category and Type */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {product.category?.name?.en || 'N/A'}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getCategoryTypeLabel(product.category?.type)}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(product.pricing?.adult, product.pricing?.currency)}
                    </div>
                    {product.pricing?.child && (
                      <div className="text-sm text-gray-500">
                        Child: {formatPrice(product.pricing.child, product.pricing.currency)}
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">
                      {product.duration?.days || 0} days
                      {product.duration?.nights && (
                        <span className="ml-2">({product.duration.nights} nights)</span>
                      )}
                    </div>
                  </div>

                  {/* Status and Featured */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.isFeatured && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit Product"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDelete(product._id, activeTab)}
                      disabled={deleteLoading === product._id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                      title="Delete Product"
                    >
                      {deleteLoading === product._id ? (
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

export default ProductsPage;

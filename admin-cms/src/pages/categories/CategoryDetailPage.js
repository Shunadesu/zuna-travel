import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, PhotoIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import apiClient from '../../utils/apiConfig';
import toast from 'react-hot-toast';

const CategoryDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/categories/${id}`);
      setCategory(response.data.data);
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await apiClient.get(`/products?category=${id}&populate=category`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h2>
        <Link
          to="/admin/categories"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/categories"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category.name.en}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {category.name.vi}
            </p>
          </div>
          <Link
            to={`/admin/categories/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Category
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Information</h2>
            
            {/* Category Image */}
            <div className="mb-6">
              {category.images && category.images.length > 0 ? (
                <img
                  className="w-full h-64 object-cover rounded-lg"
                  src={category.images[0].url}
                  alt={category.name.en}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">English</p>
                  <p className="text-gray-900">{category.description?.en || 'No description available'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vietnamese</p>
                  <p className="text-gray-900">{category.description?.vi || 'Không có mô tả'}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            {category.location && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">{category.location.en}</p>
                    <p className="text-sm text-gray-500">{category.location.vi}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <div className="flex items-center mt-1">
                  <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getCategoryTypeLabel(category.type)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Slug</p>
                <p className="text-gray-900 font-mono text-sm">{category.slug}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Sort Order</p>
                <p className="text-gray-900">{category.sortOrder}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Products Count</p>
                <p className="text-gray-900 text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Products in this Category</h2>
          <Link
            to="/admin/products/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Add Product
          </Link>
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No products found in this category</p>
            <Link
              to="/admin/products/create"
              className="inline-flex items-center px-4 py-2 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.images[0].url}
                              alt={product.title.en}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <PhotoIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title.en}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.title.vi}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(product.pricing?.adult, product.pricing?.currency)}
                      </div>
                      {product.pricing?.child && (
                        <div className="text-sm text-gray-500">
                          Child: {formatPrice(product.pricing.child, product.pricing.currency)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.duration?.days || 0} days
                      </div>
                      {product.duration?.nights && (
                        <div className="text-sm text-gray-500">
                          {product.duration.nights} nights
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;

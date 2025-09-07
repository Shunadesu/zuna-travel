import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTourStore, useTransferStore } from '../../stores';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { tours, fetchTours, getTourById } = useTourStore();
  const { transfers, fetchTransfers, getTransferById } = useTransferStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let foundProduct = getTourById(id);
      if (!foundProduct) {
        foundProduct = getTransferById(id);
      }
      
      if (!foundProduct) {
        await Promise.all([fetchTours(), fetchTransfers()]);
        foundProduct = getTourById(id) || getTransferById(id);
      }
      
      setProduct(foundProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, currency = 'USD') => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
        <p className="mt-1 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link
            to="/admin/products"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
          <Link
            to={`/admin/products/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Product
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Product Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16">
              {product.mainImage ? (
                <img
                  className="h-16 w-16 rounded-lg object-cover"
                  src={product.mainImage.url}
                  alt={product.title.en}
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {product.title.en}
              </h2>
              <p className="text-sm text-gray-500">{product.title.vi}</p>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? t('common.active') : t('common.inactive')}
                </span>
                {product.isFeatured && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {t('products.isFeatured')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">English Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.title.en}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Vietnamese Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.title.vi}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.category?.name?.en} ({product.category?.type})
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Slug</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{product.slug}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Adult Price</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatPrice(product.pricing?.adult, product.pricing?.currency)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Child Price</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.pricing?.child ? formatPrice(product.pricing.child, product.pricing.currency) : 'N/A'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Currency</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.pricing?.currency || 'USD'}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.duration?.days || 0} {t('products.days')}
                {product.duration?.nights && `, ${product.duration.nights} ${t('products.nights')}`}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Location (EN)</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.location?.en || 'Not specified'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Location (VI)</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.location?.vi || 'Not specified'}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">English Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {product.description?.en}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Vietnamese Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {product.description?.vi}
              </dd>
            </div>

            {product.shortDescription?.en && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Short Description (EN)</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.shortDescription.en}</dd>
              </div>
            )}

            {product.shortDescription?.vi && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Short Description (VI)</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.shortDescription.vi}</dd>
              </div>
            )}

            {product.highlights && product.highlights.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Highlights</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc list-inside space-y-1">
                    {product.highlights.map((highlight, index) => (
                      <li key={index}>
                        {highlight.en} / {highlight.vi}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            {product.included && product.included.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Included</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc list-inside space-y-1">
                    {product.included.map((item, index) => (
                      <li key={index}>
                        {item.en} / {item.vi}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            {product.excluded && product.excluded.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Excluded</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc list-inside space-y-1">
                    {product.excluded.map((item, index) => (
                      <li key={index}>
                        {item.en} / {item.vi}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            {product.requirements?.en && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Requirements (EN)</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {product.requirements.en}
                </dd>
              </div>
            )}

            {product.requirements?.vi && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Requirements (VI)</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {product.requirements.vi}
                </dd>
              </div>
            )}

            {product.cancellationPolicy?.en && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Cancellation Policy (EN)</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {product.cancellationPolicy.en}
                </dd>
              </div>
            )}

            {product.cancellationPolicy?.vi && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Cancellation Policy (VI)</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {product.cancellationPolicy.vi}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">Rating</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.rating?.average || 0}/5 ({product.rating?.count || 0} reviews)
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Sort Order</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.sortOrder || 0}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(product.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(product.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Product ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{product._id}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  FolderIcon, 
  CubeIcon, 
  DocumentTextIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import useDashboardStore from '../stores/dashboardStore';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import StatCard from '../components/dashboard/StatCard';
import RefreshButton from '../components/dashboard/RefreshButton';
import FeaturedContent from '../components/dashboard/FeaturedContent';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { t } = useTranslation();
  
  const { 
    stats, 
    recentActivities, 
    featuredProducts, 
    featuredBlogs,
    loading, 
    error, 
    fetchDashboardData, 
    clearError 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const statsData = [
    { name: t('dashboard.stats.totalCategories'), value: stats.totalCategories, icon: FolderIcon, color: 'bg-blue-500' },
    { name: t('dashboard.stats.totalProducts'), value: stats.totalProducts, icon: CubeIcon, color: 'bg-green-500' },
    { name: t('dashboard.stats.totalBlogs'), value: stats.totalBlogs, icon: DocumentTextIcon, color: 'bg-purple-500' },
    { name: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return <LoadingState text="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchDashboardData} title="Failed to load dashboard" />;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="mt-2 text-gray-600">Welcome to VnBestTravel Admin Panel</p>
        </div>
        <RefreshButton 
          onRefresh={() => fetchDashboardData(true)} 
          loading={loading} 
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((item) => (
          <StatCard
            key={item.name}
            name={item.name}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-2 w-2 ${activity.color} rounded-full`}></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/products/create"
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
            <Link
              to="/admin/categories/create"
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Category
            </Link>
            <Link
              to="/admin/blogs/create"
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Write New Blog Post
            </Link>
            <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FeaturedContent
          title="Featured Products"
          items={featuredProducts}
          type="product"
          emptyMessage="No featured products"
        />
        <FeaturedContent
          title="Featured Blogs"
          items={featuredBlogs}
          type="blog"
          emptyMessage="No featured blogs"
        />
      </div>
    </div>
  );
};

export default DashboardPage;

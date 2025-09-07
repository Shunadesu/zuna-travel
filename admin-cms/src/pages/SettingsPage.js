import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Cog6ToothIcon, 
  PaintBrushIcon, 
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import useSettingsStore from '../stores/settingsStore';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import SettingsPreview from '../components/settings/SettingsPreview';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('branding');
  const [formData, setFormData] = useState({});
  
  const { 
    settings, 
    loading, 
    error, 
    fetchSettingsAdmin, 
    updateSettings, 
    resetSettings, 
    clearError 
  } = useSettingsStore();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login to access settings');
      navigate('/auth/login');
      return;
    }
    
    fetchSettingsAdmin();
  }, [fetchSettingsAdmin, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else if (typeof value === 'object') {
      // Handle nested objects like topBar, footer
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateSettings(formData);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to defaults?')) {
      return;
    }
    
    try {
      await resetSettings();
      toast.success('Settings reset successfully');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchSettingsAdmin} />;
  }

  const tabs = [
    { id: 'branding', name: 'Branding', icon: BuildingOfficeIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'contact', name: 'Contact', icon: EnvelopeIcon },
    { id: 'social', name: 'Social Media', icon: GlobeAltIcon },
    { id: 'features', name: 'Features', icon: Cog6ToothIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your website settings and configuration</p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Branding</h3>
              
              {/* Company Information */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-md font-medium text-gray-800 mb-4">Company Information</h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name (English)
                    </label>
                    <input
                      type="text"
                      value={formData.companyName?.en || ''}
                      onChange={(e) => handleInputChange('companyName', { ...formData.companyName, en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="VnBestTravel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name (Vietnamese)
                    </label>
                    <input
                      type="text"
                      value={formData.companyName?.vi || ''}
                      onChange={(e) => handleInputChange('companyName', { ...formData.companyName, vi: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="VnBestTravel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description (English)
                    </label>
                    <textarea
                      value={formData.companyDescription?.en || ''}
                      onChange={(e) => handleInputChange('companyDescription', { ...formData.companyDescription, en: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Your trusted travel partner in Vietnam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description (Vietnamese)
                    </label>
                    <textarea
                      value={formData.companyDescription?.vi || ''}
                      onChange={(e) => handleInputChange('companyDescription', { ...formData.companyDescription, vi: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Đối tác du lịch đáng tin cậy của bạn tại Việt Nam"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Colors */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 mb-4">Brand Colors</h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.primaryColor || '#3B82F6'}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor || '#3B82F6'}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.secondaryColor || '#10B981'}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor || '#10B981'}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
              
              {/* Top Bar Styling */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-md font-medium text-gray-800 mb-4">Top Bar Styling</h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.topBar?.backgroundColor || '#1F2937'}
                        onChange={(e) => handleInputChange('topBar', { ...formData.topBar, backgroundColor: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.topBar?.backgroundColor || '#1F2937'}
                        onChange={(e) => handleInputChange('topBar', { ...formData.topBar, backgroundColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#1F2937"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.topBar?.textColor || '#FFFFFF'}
                        onChange={(e) => handleInputChange('topBar', { ...formData.topBar, textColor: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.topBar?.textColor || '#FFFFFF'}
                        onChange={(e) => handleInputChange('topBar', { ...formData.topBar, textColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hover Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.topBar?.hoverColor || '#93C5FD'}
                        onChange={(e) => handleInputChange('topBar', { ...formData.topBar, hoverColor: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.topBar?.hoverColor || '#93C5FD'}
                        onChange={(e) => handleInputChange('topBar', { ...formData.topBar, hoverColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#93C5FD"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Top Bar Preview */}
                <SettingsPreview settings={formData} type="topBar" />
              </div>

              {/* Footer Styling */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 mb-4">Footer Styling</h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.footer?.backgroundColor || '#111827'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, backgroundColor: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.footer?.backgroundColor || '#111827'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, backgroundColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#111827"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.footer?.textColor || '#F9FAFB'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, textColor: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.footer?.textColor || '#F9FAFB'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, textColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#F9FAFB"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Text Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.footer?.secondaryTextColor || '#9CA3AF'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, secondaryTextColor: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.footer?.secondaryTextColor || '#9CA3AF'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, secondaryTextColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#9CA3AF"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.footer?.borderColor || '#374151'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, borderColor: e.target.value })}
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.footer?.borderColor || '#374151'}
                        onChange={(e) => handleInputChange('footer', { ...formData.footer, borderColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="#374151"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Footer Preview */}
                <SettingsPreview settings={formData} type="footer" />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="info@zunatravel.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="+84 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="+84 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address (English)
                  </label>
                  <textarea
                    value={formData.address?.en || ''}
                    onChange={(e) => handleInputChange('address', { ...formData.address, en: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="123 Travel Street, Hanoi, Vietnam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address (Vietnamese)
                  </label>
                  <textarea
                    value={formData.address?.vi || ''}
                    onChange={(e) => handleInputChange('address', { ...formData.address, vi: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="123 Đường Du Lịch, Hà Nội, Việt Nam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours (English)
                  </label>
                  <input
                    type="text"
                    value={formData.businessHours?.en || ''}
                    onChange={(e) => handleInputChange('businessHours', { ...formData.businessHours, en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours (Vietnamese)
                  </label>
                  <input
                    type="text"
                    value={formData.businessHours?.vi || ''}
                    onChange={(e) => handleInputChange('businessHours', { ...formData.businessHours, vi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Thứ 2 - Thứ 6: 9:00 - 18:00"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.facebook || ''}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://facebook.com/zunatravel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://instagram.com/zunatravel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={formData.youtube || ''}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://youtube.com/zunatravel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    value={formData.tiktok || ''}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://tiktok.com/@zunatravel"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enable Newsletter
                    </label>
                    <p className="text-sm text-gray-500">Allow users to subscribe to newsletter</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.features?.enableNewsletter || false}
                    onChange={(e) => handleInputChange('features', { ...formData.features, enableNewsletter: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enable Social Login
                    </label>
                    <p className="text-sm text-gray-500">Allow users to login with social media</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.features?.enableSocialLogin || false}
                    onChange={(e) => handleInputChange('features', { ...formData.features, enableSocialLogin: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <p className="text-sm text-gray-500">Put website in maintenance mode</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.features?.maintenanceMode || false}
                    onChange={(e) => handleInputChange('features', { ...formData.features, maintenanceMode: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={formData.googleAnalyticsId || ''}
                    onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={formData.facebookPixelId || ''}
                    onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

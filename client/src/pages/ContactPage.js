import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok 
} from 'react-icons/fa';
import { useSettingsStore } from '../stores';
import toast from 'react-hot-toast';
import ConsultationModal from '../components/common/ConsultationModal';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const { settings, fetchSettings } = useSettingsStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []); // Only run once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('contact.formSuccess'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(t('contact.formError'));
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: FaFacebook, 
      url: settings?.facebook,
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Instagram', 
      icon: FaInstagram, 
      url: settings?.instagram,
      color: 'hover:text-pink-600'
    },
    { 
      name: 'YouTube', 
      icon: FaYoutube, 
      url: settings?.youtube,
      color: 'hover:text-red-600'
    },
    { 
      name: 'TikTok', 
      icon: FaTiktok, 
      url: settings?.tiktok,
      color: 'hover:text-black'
    },
  ].filter(social => social.url);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {t('contact.subtitle')}
          </p>
          
          {/* Consultation CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mr-3" />
              <h2 className="text-2xl font-bold">Free Travel Consultation</h2>
            </div>
            <p className="text-blue-100 mb-4">
              Get personalized travel advice from our experts. Tell us about your dream trip and we'll help you plan it perfectly!
            </p>
            <button
              onClick={() => setShowConsultationModal(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Free Consultation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t('contact.sendMessage')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('contact.phonePlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.subject')} *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t('contact.messagePlaceholder')}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-md font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: settings?.primaryColor || '#3B82F6'
                }}
              >
                {loading ? t('contact.sending') : t('contact.sendMessage')}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('contact.contactInfo')}
              </h2>
              
              <div className="space-y-6">
                {settings?.phone && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <PhoneIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t('contact.phone')}
                      </h3>
                      <a 
                        href={`tel:${settings.phone}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {settings?.email && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t('contact.email')}
                      </h3>
                      <a 
                        href={`mailto:${settings.email}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {settings?.address?.[i18n.language] && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MapPinIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t('contact.address')}
                      </h3>
                      <p className="text-gray-600">
                        {settings.address[i18n.language]}
                      </p>
                    </div>
                  </div>
                )}
                
                {settings?.businessHours?.[i18n.language] && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t('contact.businessHours')}
                      </h3>
                      <p className="text-gray-600">
                        {settings.businessHours[i18n.language]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t('contact.followUs')}
                </h2>
                
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full bg-gray-100 text-gray-600 transition-all duration-200 ${social.color}`}
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('contact.location')}
              </h2>
              
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424177981303!2d106.6983153152608!3d10.776755992319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46f64b933f%3A0xf8a6e5b2a5a4f1f4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiB2aWV0!5e0!3m2!1svi!2s!4v1629789456789!5m2!1svi!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={showConsultationModal} 
        onClose={() => setShowConsultationModal(false)} 
      />
    </div>
  );
};

export default ContactPage;


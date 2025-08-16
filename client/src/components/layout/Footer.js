import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok 
} from 'react-icons/fa';
import { useSettingsStore } from '../../stores';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, []); // Only run once on mount

  const currentYear = new Date().getFullYear();

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

  const quickLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.tours'), href: '/tours' },
    { name: t('nav.transfers'), href: '/transfers' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <footer 
      style={{
        backgroundColor: settings?.footer?.backgroundColor || '#1F2937',
        color: settings?.footer?.textColor || '#FFFFFF'
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="text-2xl font-bold" style={{ color: settings?.primaryColor || '#3B82F6' }}>
                {settings?.companyName?.[i18n.language] || 'Zuna Travel'}
              </div>
            </div>
            {settings?.companyDescription?.[i18n.language] && (
              <p 
                className="mb-4"
                style={{
                  color: settings?.footer?.secondaryTextColor || '#D1D5DB'
                }}
              >
                {settings.companyDescription[i18n.language]}
              </p>
            )}
            
            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                    style={{
                      color: settings?.footer?.secondaryTextColor || '#D1D5DB'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = social.color.replace('hover:text-', '').includes('blue') ? '#3B82F6' :
                        social.color.replace('hover:text-', '').includes('pink') ? '#EC4899' :
                        social.color.replace('hover:text-', '').includes('red') ? '#EF4444' : '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = settings?.footer?.secondaryTextColor || '#D1D5DB';
                    }}
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="transition-colors"
                    style={{
                      color: settings?.footer?.secondaryTextColor || '#D1D5DB'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = settings?.footer?.textColor || '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = settings?.footer?.secondaryTextColor || '#D1D5DB';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h3>
            <div className="space-y-3">
              {settings?.phone && (
                <div className="flex items-center" style={{ color: settings?.footer?.secondaryTextColor || '#D1D5DB' }}>
                  <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <a 
                    href={`tel:${settings.phone}`} 
                    className="transition-colors"
                    style={{ color: settings?.footer?.secondaryTextColor || '#D1D5DB' }}
                    onMouseEnter={(e) => {
                      e.target.style.color = settings?.footer?.textColor || '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = settings?.footer?.secondaryTextColor || '#D1D5DB';
                    }}
                  >
                    {settings.phone}
                  </a>
                </div>
              )}
              
              {settings?.email && (
                <div className="flex items-center" style={{ color: settings?.footer?.secondaryTextColor || '#D1D5DB' }}>
                  <EnvelopeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <a 
                    href={`mailto:${settings.email}`} 
                    className="transition-colors"
                    style={{ color: settings?.footer?.secondaryTextColor || '#D1D5DB' }}
                    onMouseEnter={(e) => {
                      e.target.style.color = settings?.footer?.textColor || '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = settings?.footer?.secondaryTextColor || '#D1D5DB';
                    }}
                  >
                    {settings.email}
                  </a>
                </div>
              )}
              
              {settings?.address?.[i18n.language] && (
                <div className="flex items-start" style={{ color: settings?.footer?.secondaryTextColor || '#D1D5DB' }}>
                  <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{settings.address[i18n.language]}</span>
                </div>
              )}
              
              {settings?.businessHours?.[i18n.language] && (
                <div className="flex items-start" style={{ color: settings?.footer?.secondaryTextColor || '#D1D5DB' }}>
                  <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{settings.businessHours[i18n.language]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter.title')}</h3>
            <p 
              className="mb-4"
              style={{
                color: settings?.footer?.secondaryTextColor || '#D1D5DB'
              }}
            >
              {t('footer.newsletter.description')}
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-md font-medium transition-all duration-200"
                style={{
                  backgroundColor: settings?.primaryColor || '#3B82F6',
                  color: 'white'
                }}
              >
                {t('footer.newsletter.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="mt-8 pt-8"
          style={{
            borderTop: `1px solid ${settings?.footer?.borderColor || '#374151'}`
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div 
              className="text-sm"
              style={{
                color: settings?.footer?.secondaryTextColor || '#D1D5DB'
              }}
            >
              © {currentYear} {settings?.companyName?.[i18n.language] || 'Zuna Travel'}. {t('footer.allRightsReserved')}
            </div>
            
            {settings?.footerText?.[i18n.language] && (
              <div 
                className="text-sm mt-2 md:mt-0"
                style={{
                  color: settings?.footer?.secondaryTextColor || '#D1D5DB'
                }}
              >
                {settings.footerText[i18n.language]}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


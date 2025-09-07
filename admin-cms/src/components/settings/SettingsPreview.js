import React from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const SettingsPreview = ({ settings, type }) => {
  if (type === 'topBar') {
    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Top Bar Preview</h5>
        <div 
          className="py-2 px-4 rounded"
          style={{
            backgroundColor: settings?.topBar?.backgroundColor || '#1F2937',
            color: settings?.topBar?.textColor || '#FFFFFF'
          }}
        >
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <a 
                className="flex items-center transition-colors"
                style={{
                  color: settings?.topBar?.textColor || '#FFFFFF',
                  '--tw-text-opacity': '1'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = settings?.topBar?.hoverColor || '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = settings?.topBar?.textColor || '#FFFFFF';
                }}
              >
                <PhoneIcon className="h-4 w-4 mr-1" />
                +84 123 456 789
              </a>
              <a 
                className="flex items-center transition-colors"
                style={{
                  color: settings?.topBar?.textColor || '#FFFFFF',
                  '--tw-text-opacity': '1'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = settings?.topBar?.hoverColor || '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = settings?.topBar?.textColor || '#FFFFFF';
                }}
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                info@zunatravel.com
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center transition-colors"
                style={{
                  color: settings?.topBar?.textColor || '#FFFFFF',
                  '--tw-text-opacity': '1'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = settings?.topBar?.hoverColor || '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = settings?.topBar?.textColor || '#FFFFFF';
                }}
              >
                <GlobeAltIcon className="h-4 w-4 mr-1" />
                VI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'footer') {
    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Footer Preview</h5>
        <div 
          className="p-4 rounded"
          style={{
            backgroundColor: settings?.footer?.backgroundColor || '#1F2937',
            color: settings?.footer?.textColor || '#FFFFFF'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="text-lg font-semibold mb-2">VnBestTravel</h6>
              <p 
                className="text-sm mb-3"
                style={{
                  color: settings?.footer?.secondaryTextColor || '#D1D5DB'
                }}
              >
                Your trusted travel partner in Vietnam
              </p>
              <div className="flex space-x-3">
                <a 
                  className="transition-colors"
                  style={{
                    color: settings?.footer?.secondaryTextColor || '#D1D5DB'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#3B82F6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = settings?.footer?.secondaryTextColor || '#D1D5DB';
                  }}
                >
                  <PhoneIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h6 className="text-lg font-semibold mb-2">Quick Links</h6>
              <ul className="space-y-1">
                <li>
                  <a 
                    className="text-sm transition-colors"
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
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    className="text-sm transition-colors"
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
                    Tours
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div 
            className="mt-4 pt-4 text-sm"
            style={{
              borderTop: `1px solid ${settings?.footer?.borderColor || '#374151'}`,
              color: settings?.footer?.secondaryTextColor || '#D1D5DB'
            }}
          >
            © 2024 VnBestTravel. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SettingsPreview;




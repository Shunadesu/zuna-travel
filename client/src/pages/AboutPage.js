import React from 'react';
import { useSettingsStore } from '../stores';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const { settings } = useSettingsStore();

  const teamMembers = [
    {
      name: 'Nguyen Van A',
      position: 'CEO & Founder',
      image: '/team/ceo.jpg',
      bio: 'With over 15 years of experience in the travel industry, our CEO leads the company with passion and vision.'
    },
    {
      name: 'Tran Thi B',
      position: 'Operations Manager',
      image: '/team/operations.jpg',
      bio: 'Ensuring smooth operations and exceptional customer service across all our travel services.'
    },
    {
      name: 'Le Van C',
      position: 'Tour Guide Coordinator',
      image: '/team/guide.jpg',
      bio: 'Coordinating our team of experienced tour guides to provide authentic local experiences.'
    },
    {
      name: 'Pham Thi D',
      position: 'Customer Relations',
      image: '/team/customer.jpg',
      bio: 'Dedicated to ensuring every customer has an unforgettable travel experience.'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Customers' },
    { number: '100+', label: 'Destinations' },
    { number: '10+', label: 'Years Experience' },
    { number: '24/7', label: 'Support' }
  ];

  const values = [
    {
      title: 'Authentic Experiences',
      description: 'We believe in providing genuine, local experiences that go beyond typical tourist attractions.',
      icon: '🌟'
    },
    {
      title: 'Customer Satisfaction',
      description: 'Your satisfaction is our top priority. We go above and beyond to exceed your expectations.',
      icon: '❤️'
    },
    {
      title: 'Sustainable Tourism',
      description: 'We promote responsible travel practices that benefit local communities and preserve natural resources.',
      icon: '🌱'
    },
    {
      title: 'Expert Knowledge',
      description: 'Our team of travel experts provides insider knowledge and personalized recommendations.',
      icon: '🎯'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Zuna Travel</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are passionate about creating unforgettable travel experiences in Vietnam and beyond. 
          Our mission is to connect travelers with authentic local experiences while providing exceptional service.
        </p>
      </div>

      {/* Company Story */}
      <div className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2014, Zuna Travel began as a small local tour operator with a big dream: 
                to show the world the authentic beauty of Vietnam through the eyes of locals.
              </p>
              <p>
                What started with just a few tours in Ho Chi Minh City has grown into a comprehensive 
                travel company offering tours, transfers, and travel services across Vietnam and Southeast Asia.
              </p>
              <p>
                Today, we're proud to have served thousands of happy customers from around the world, 
                helping them discover the rich culture, stunning landscapes, and warm hospitality that Vietnam has to offer.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/about/company-story.jpg"
              alt="Zuna Travel Team"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-blue-600 opacity-20 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-16 bg-blue-50 rounded-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold" style={{ display: 'none' }}>
                  {member.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.position}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Zuna Travel?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What Makes Us Different</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Local expertise and insider knowledge</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Personalized travel experiences</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">24/7 customer support</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Competitive pricing with no hidden fees</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Sustainable and responsible tourism practices</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment</h3>
            <p className="text-gray-600 mb-4">
              We are committed to providing exceptional travel experiences that not only satisfy our customers 
              but also contribute positively to the local communities and environment.
            </p>
            <p className="text-gray-600">
              Every tour, transfer, and service we provide is carefully designed to ensure safety, 
              comfort, and authentic experiences that create lasting memories.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
            <MapPinIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">
              {settings?.company?.address || '123 Travel Street, Ho Chi Minh City, Vietnam'}
            </p>
          </div>
          <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
            <PhoneIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">
              {settings?.contact?.phone || '+84 123 456 789'}
            </p>
          </div>
          <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
            <EnvelopeIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">
              {settings?.contact?.email || 'info@zunatravel.com'}
            </p>
          </div>
          <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
            <ClockIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
            <p className="text-gray-600">
              {settings?.company?.businessHours || 'Mon - Fri: 8:00 AM - 6:00 PM'}
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
        <p className="text-xl mb-6 opacity-90">
          Let us help you create unforgettable memories in Vietnam and beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Browse Tours
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;







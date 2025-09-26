import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useConsultationStore from '../../stores/consultationStore';

const ConsultationsPage = () => {
  const { t } = useTranslation();
  const {
    consultations,
    stats,
    loading,
    error,
    fetchConsultations,
    fetchStats,
    updateConsultationStatus,
    addContactHistory,
    deleteConsultation
  } = useConsultationStore();

  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  useEffect(() => {
    fetchConsultations();
    fetchStats();
  }, [fetchConsultations, fetchStats]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteConsultation(id);
      toast.success('Consultation deleted successfully');
    } catch (error) {
      console.error('Error deleting consultation:', error);
      toast.error('Failed to delete consultation');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateConsultationStatus(id, { status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAddContact = async (id, contactData) => {
    try {
      await addContactHistory(id, contactData);
      toast.success('Contact history added successfully');
      setShowContactModal(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact history');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
      case 'contacted':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter consultations
  const filteredConsultations = consultations?.filter(consultation => {
    const matchesSearch = !searchTerm || 
                         consultation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || consultation.status === selectedStatus;
    const matchesPriority = !selectedPriority || consultation.priority === selectedPriority;
    const matchesSource = !selectedSource || consultation.source === selectedSource;

    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Consultation Management</h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <InformationCircleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.byStatus.new}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.byStatus.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.avgResponseTime}h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search consultations..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="google">Google</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('');
                setSelectedPriority('');
                setSelectedSource('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredConsultations.length} of {consultations.length} consultations
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredConsultations.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mb-4">No consultations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <EnvelopeIcon className="h-3 w-3 mr-1" />
                          {consultation.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {consultation.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{consultation.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {consultation.message}
                      </div>
                      {consultation.tourReference && (
                        <div className="text-xs text-blue-600 mt-1">
                          📍 Tour: {consultation.tourReference.tourTitle}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {getStatusIcon(consultation.status)}
                        <span className="ml-1 capitalize">{consultation.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(consultation.priority)}`}>
                        {consultation.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(consultation.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setShowContactModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Add Contact"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(consultation._id)}
                          disabled={deleteLoading === consultation._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === consultation._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <XCircleIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedConsultation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Consultation Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Contact Information</h4>
                  <div className="mt-2 space-y-1">
                    <p><strong>Name:</strong> {selectedConsultation.name}</p>
                    <p><strong>Email:</strong> {selectedConsultation.email}</p>
                    <p><strong>Phone:</strong> {selectedConsultation.phone}</p>
                    <p><strong>Preferred Contact:</strong> {selectedConsultation.preferredContactMethod}</p>
                    <p><strong>Preferred Time:</strong> {selectedConsultation.preferredContactTime}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Consultation Details</h4>
                  <div className="mt-2 space-y-1">
                    <p><strong>Subject:</strong> {selectedConsultation.subject}</p>
                    <p><strong>Message:</strong> {selectedConsultation.message}</p>
                  </div>
                </div>
                
                {selectedConsultation.tourReference && (
                  <div>
                    <h4 className="font-medium text-gray-900">Tour Reference</h4>
                    <div className="mt-2 space-y-1">
                      <p><strong>Tour:</strong> {selectedConsultation.tourReference.tourTitle}</p>
                      <p><strong>Price:</strong> ${selectedConsultation.tourReference.tourPrice}</p>
                      <p><strong>Slug:</strong> {selectedConsultation.tourReference.tourSlug}</p>
                    </div>
                  </div>
                )}
                
                {selectedConsultation.travelDates && (
                  <div>
                    <h4 className="font-medium text-gray-900">Travel Information</h4>
                    <div className="mt-2 space-y-1">
                      <p><strong>Travel Dates:</strong> {selectedConsultation.travelDates.startDate ? new Date(selectedConsultation.travelDates.startDate).toLocaleDateString() : 'Flexible'}</p>
                      <p><strong>Travelers:</strong> {selectedConsultation.numberOfTravelers?.adults} adults, {selectedConsultation.numberOfTravelers?.children} children</p>
                      <p><strong>Budget:</strong> {selectedConsultation.budget}</p>
                      {selectedConsultation.interests && selectedConsultation.interests.length > 0 && (
                        <p><strong>Interests:</strong> {selectedConsultation.interests.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-900">Status Management</h4>
                  <div className="mt-2 flex space-x-2">
                    {['new', 'contacted', 'in-progress', 'completed', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedConsultation._id, status)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          selectedConsultation.status === status 
                            ? getStatusColor(status)
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedConsultation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Contact History</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleAddContact(selectedConsultation._id, {
                  method: formData.get('method'),
                  notes: formData.get('notes')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                    <select
                      name="method"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add notes about the contact..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add Contact
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;

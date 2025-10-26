"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Service {
  id: number;
  serviceName: string;
  description: string;
  imagePath: string | null;
}

interface ServiceRequest {
  id: number;
  userName: string;
  userEmail: string;
  message: string;
  serviceId: number;
  serviceName: string;
}

export default function ServiceRequestPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    message: '',
    serviceId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState<'request' | 'view'>('request');

  const API_BASE_URL = 'http://localhost:8080/api';
  const SERVICES_URL = `${API_BASE_URL}/services`;
  const REQUESTS_URL = `${API_BASE_URL}/requests`;

  // Fetch all services
  const fetchServices = async (): Promise<void> => {
    try {
      const response = await fetch(SERVICES_URL);
      if (response.ok) {
        const data: Service[] = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      showMessage('Error fetching services', 'error');
    }
  };

  // Fetch all service requests
  const fetchRequests = async (): Promise<void> => {
    try {
      const response = await fetch(REQUESTS_URL);
      if (response.ok) {
        const data: ServiceRequest[] = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showMessage('Error fetching requests', 'error');
    }
  };

  useEffect(() => {
    fetchServices();
    fetchRequests();
  }, []);

  // Show message helper
  const showMessage = (msg: string, type: 'success' | 'error' = 'success'): void => {
    setMessage(msg);
    setMessageType(type);
  };

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form
  const resetForm = (): void => {
    setFormData({
      userName: '',
      userEmail: '',
      message: '',
      serviceId: ''
    });
  };

  // Submit service request
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.serviceId) {
      showMessage('Please select a service', 'error');
      setLoading(false);
      return;
    }

    const requestData = {
      userName: formData.userName,
      userEmail: formData.userEmail,
      message: formData.message,
      serviceId: parseInt(formData.serviceId)
    };

    try {
      const response = await fetch(REQUESTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result: ServiceRequest = await response.json();
        showMessage('Service request submitted successfully! We will contact you soon.', 'success');
        resetForm();
        fetchRequests();
        setActiveTab('view');
      } else {
        const errorText = await response.text();
        showMessage(`Error: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      showMessage('Error submitting request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Request a Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to request our wooden services. We'll get back to you shortly.
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-4 rounded-lg ${
            messageType === 'error'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <div className="flex justify-between items-center">
              <span>{message}</span>
              <button
                onClick={() => setMessage('')}
                className="text-lg font-semibold hover:opacity-70"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'request'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Request Service
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'view'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Requests ({requests.length})
          </button>
        </div>

        {/* Request Service Form */}
        {activeTab === 'request' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Service Request Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service *
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a service...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Can't find what you're looking for? <a href="/services" className="text-blue-600 hover:underline">Browse all services</a>
                </p>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your project requirements, timeline, budget, and any specific details..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Request...
                  </>
                ) : (
                  'Submit Service Request'
                )}
              </button>
            </form>
          </div>
        )}

        {/* View Requests Tab */}
        {activeTab === 'view' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              My Service Requests ({requests.length})
            </h2>

            {requests.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No service requests yet.</p>
                <p className="text-gray-400">Submit your first service request to get started!</p>
                <button
                  onClick={() => setActiveTab('request')}
                  className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Request
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {request.serviceName}
                        </h3>
                        <p className="text-gray-600">
                          Submitted by: {request.userName}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        Request #{request.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact Email</p>
                        <p className="text-gray-800">{request.userEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service ID</p>
                        <p className="text-gray-800">#{request.serviceId}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Project Details</p>
                      <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                        {request.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
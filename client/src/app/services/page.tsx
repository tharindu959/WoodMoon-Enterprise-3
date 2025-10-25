"use client";

import { useState, useEffect } from 'react';

interface Service {
  id: number;
  serviceName: string;
  description: string;
  imagePath: string | null;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8080/api/services';

  // Fetch all services
  const fetchServices = async (): Promise<void> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data: Service[] = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Wooden Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our premium wooden services and craftsmanship
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
            </svg>
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
            <p className="text-gray-400">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {service.imagePath && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={`http://localhost:8080${service.imagePath}`}
                      alt={service.serviceName}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {service.serviceName}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Service ID: #{service.id}</span>
                    <button
                      onClick={() => window.location.href = '/request-service'}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Request This Service
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Interested in Our Services?
            </h2>
            <p className="text-gray-600 mb-6">
              Submit a service request and we'll get back to you with a custom quote.
            </p>
            <button
              onClick={() => window.location.href = '/request-service'}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Request a Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
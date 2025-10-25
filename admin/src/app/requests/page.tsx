"use client";

import { useState, useEffect } from 'react';

interface ServiceRequest {
  id: number;
  userName: string;
  userEmail: string;
  message: string;
  serviceId: number;
  serviceName: string;
}

export default function RequestsManagement() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8080/api/requests';

  const fetchRequests = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const deleteRequest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Service Requests Management
      </h1>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No service requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {request.serviceName}
                  </h3>
                  <p className="text-gray-600">
                    From: {request.userName} ({request.userEmail})
                  </p>
                </div>
                <button
                  onClick={() => deleteRequest(request.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Message:</p>
                <p className="text-gray-800 bg-gray-50 p-4 rounded">
                  {request.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
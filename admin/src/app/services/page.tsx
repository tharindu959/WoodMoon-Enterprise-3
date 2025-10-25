"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Service {
  id: number;
  serviceName: string;
  description: string;
  imagePath: string | null;
}

interface FormData {
  serviceName: string;
  description: string;
  image: File | null;
}

interface DeleteDialog {
  open: boolean;
  serviceId: number | null;
  serviceName: string;
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<FormData>({
    serviceName: '',
    description: '',
    image: null
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>({
    open: false,
    serviceId: null,
    serviceName: ''
  });

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
      showMessage('Error fetching services', 'error');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Show message helper
  const showMessage = (msg: string, type: 'success' | 'error' = 'success'): void => {
    setMessage(msg);
    setMessageType(type);
  };

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  // Reset form
  const resetForm = (): void => {
    setFormData({
      serviceName: '',
      description: '',
      image: null
    });
    setEditingId(null);
  };

  // Create or update service
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const submitData = new FormData();
    submitData.append('serviceName', formData.serviceName);
    submitData.append('description', formData.description);
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      if (response.ok) {
        const result: Service = await response.json();
        showMessage(editingId ? 'Service updated successfully!' : 'Service created successfully!');
        resetForm();
        fetchServices();
      } else {
        const errorText = await response.text();
        showMessage(`Error: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      showMessage('Error saving service', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit service
  const handleEdit = (service: Service): void => {
    setFormData({
      serviceName: service.serviceName,
      description: service.description,
      image: null
    });
    setEditingId(service.id);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (service: Service): void => {
    setDeleteDialog({
      open: true,
      serviceId: service.id,
      serviceName: service.serviceName
    });
  };

  // Close delete dialog
  const handleCloseDeleteDialog = (): void => {
    setDeleteDialog({ open: false, serviceId: null, serviceName: '' });
  };

  // Delete service
  const handleDeleteConfirm = async (): Promise<void> => {
    const { serviceId } = deleteDialog;

    if (!serviceId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('Service deleted successfully!');
        fetchServices();
      } else {
        const errorText = await response.text();
        showMessage(`Error: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      showMessage('Error deleting service', 'error');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        WoodMoon Services Management
      </h1>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Service' : 'Create New Service'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter service name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter service description"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Service Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {editingId ? 'Upload new image to replace existing one' : 'Optional: Upload service image'}
              </p>
            </div>

            {formData.image && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  Selected file: <span className="font-medium">{formData.image.name}</span>
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {editingId ? 'Update Service' : 'Create Service'}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Services List */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Existing Services ({services.length})
          </h2>

          {services.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
              </svg>
              <p className="mt-4 text-gray-500 text-lg">No services found.</p>
              <p className="text-gray-400">Create your first service!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {service.imagePath && (
                          <div className="flex-shrink-0">
                            <img
                              src={`http://localhost:8080${service.imagePath}`}
                              alt={service.serviceName}
                              className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-800 truncate">
                            {service.serviceName}
                          </h3>
                          <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service)}
                        className="px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete the service &quot;{deleteDialog.serviceName}&quot;?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3 p-6 bg-gray-50 rounded-b-lg">
              <button
                onClick={handleCloseDeleteDialog}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
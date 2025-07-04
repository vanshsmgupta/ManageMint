import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Calendar, User, DollarSign, Upload, X, Edit2, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';

interface GeneratedOffer {
  id: string;
  consultantName: string;
  client: string;
  vendor: string;
  marketer: string;
  inhouseEngineer: string;
  technology: string;
  startDate: string;
  endDate?: string;
  resume: string;
  timesheet?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'ongoing' | 'completed';
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
}

interface OfferFormData {
  consultantName: string;
  client: string;
  vendor: string;
  marketer: string;
  inhouseEngineer: string;
  technology: string;
  startDate: string;
  endDate: string;
  resume: File | null;
  timesheet: File | null;
}

interface Vendor {
  id: string;
  companyName: string;
  email: string;
  type: string;
}

interface Client {
  id: string;
  companyName: string;
  email: string;
}

interface IP {
  id: string;
  companyName: string;
  email: string;
  type: string;
}

// Mock data for development
const mockOffers: GeneratedOffer[] = [
  {
    id: '1',
    consultantName: 'John Doe',
    client: 'Tech Corp',
    vendor: 'Vendor A',
    marketer: 'Jane Smith',
    inhouseEngineer: 'Bob Wilson',
    technology: 'React',
    startDate: '2024-03-01',
    endDate: '2024-09-01',
    resume: 'john-doe-resume.pdf',
    status: 'pending',
    createdAt: '2024-02-28',
  },
  {
    id: '2',
    consultantName: 'Alice Brown',
    client: 'Innovation Inc',
    vendor: 'Vendor B',
    marketer: 'Jane Smith',
    inhouseEngineer: 'Charlie Davis',
    technology: 'Node.js',
    startDate: '2024-04-01',
    resume: 'alice-brown-resume.pdf',
    status: 'accepted',
    createdAt: '2024-03-01',
  },
];

const buttonStyles = `
  .button-primary {
    background-color: #9333EA;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }

  .button-primary:hover {
    background-color: #7928CA;
  }

  .button-primary:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-purple-500;
  }

  .button-secondary {
    background-color: #6366F1;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }

  .button-secondary:hover {
    background-color: #5355E8;
  }
`;

const OfferGenerated = () => {
  // Initialize offers from localStorage or fallback to empty array (not mock data)
  const [offers, setOffers] = useState<GeneratedOffer[]>(() => {
    const storedOffers = localStorage.getItem('generatedOffers');
    return storedOffers ? JSON.parse(storedOffers) : [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<OfferFormData>({
    consultantName: '',
    client: '',
    vendor: '',
    marketer: '',
    inhouseEngineer: '',
    technology: '',
    startDate: '',
    endDate: '',
    resume: null,
    timesheet: null,
  });
  const [selectedOffer, setSelectedOffer] = useState<GeneratedOffer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<OfferFormData>({
    consultantName: '',
    client: '',
    vendor: '',
    marketer: '',
    inhouseEngineer: '',
    technology: '',
    startDate: '',
    endDate: '',
    resume: null,
    timesheet: null,
  });
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const savedVendors = localStorage.getItem('vendors');
    return savedVendors ? JSON.parse(savedVendors) : [];
  });
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });
  const [ips, setIPs] = useState<IP[]>(() => {
    const savedIPs = localStorage.getItem('implementationPartners');
    return savedIPs ? JSON.parse(savedIPs) : [];
  });

  // Fetch offers and users when component mounts
  useEffect(() => {
    fetchOffers();
    fetchUsers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      const response = await axios.get('/api/offers/generated');
      if (response.data && Array.isArray(response.data)) {
        // Update both state and localStorage
        setOffers(response.data);
        localStorage.setItem('generatedOffers', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error fetching offers from API:', error);
      // If API fails, try to get from localStorage
      const storedOffers = localStorage.getItem('generatedOffers');
      if (storedOffers) {
        const parsedOffers = JSON.parse(storedOffers);
        setOffers(parsedOffers);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Get stored users from localStorage (where admin stores them)
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        // Filter only active users with 'user' role
        const activeEngineers = parsedUsers.filter(
          (user: User) => user.role === 'user' && user.status === 'active'
        );
        setUsers(activeEngineers);
      } else {
        setUsers([]);
        toast.error('No users found in the system');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submission started'); // Debug log

    // Validate required fields
    if (!formData.consultantName || !formData.client || !formData.vendor || 
        !formData.marketer || !formData.inhouseEngineer || !formData.technology || 
        !formData.startDate || !formData.resume) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      console.log('Validation passed, processing form...'); // Debug log
      
      // Show loading state
      const loadingToast = toast.loading('Generating offer...');

      // Create form data for file upload
      const uploadFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          uploadFormData.append(key, formData[key]);
        }
      });

      // Create new offer object
      const newOffer: GeneratedOffer = {
        id: Math.random().toString(36).substr(2, 9),
        consultantName: formData.consultantName,
        client: formData.client,
        vendor: formData.vendor,
        marketer: formData.marketer,
        inhouseEngineer: formData.inhouseEngineer,
        technology: formData.technology,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        resume: formData.resume ? formData.resume.name : '',
        timesheet: formData.timesheet ? formData.timesheet.name : undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      console.log('Uploading files...'); // Debug log

      // First upload files if any
      let uploadedFiles = {};
      if (formData.resume || formData.timesheet) {
        try {
          const uploadResponse = await axios.post('/api/offers/upload', uploadFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          uploadedFiles = uploadResponse.data;
          console.log('Files uploaded successfully'); // Debug log
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          toast.error('Failed to upload files');
          toast.dismiss(loadingToast);
          return;
        }
      }

      console.log('Saving offer...'); // Debug log

      // Then create the offer with file references
      try {
        await axios.post('/api/offers/generate', {
          ...newOffer,
          ...uploadedFiles,
        });
        console.log('Offer saved to API successfully'); // Debug log
      } catch (apiError) {
        console.error('API call failed:', apiError);
        toast.error('Failed to save offer to server');
        toast.dismiss(loadingToast);
        return;
      }

      // Update local storage and state
      const updatedOffers = [newOffer, ...offers];
      localStorage.setItem('generatedOffers', JSON.stringify(updatedOffers));
      setOffers(updatedOffers);

      // Store in user's offers
      const userOffersKey = `userOffers_${formData.inhouseEngineer}`;
      const existingUserOffers = JSON.parse(localStorage.getItem(userOffersKey) || '[]');
      localStorage.setItem(userOffersKey, JSON.stringify([newOffer, ...existingUserOffers]));
      
      console.log('Local storage updated successfully'); // Debug log

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Offer generated successfully');
      
      // Close modal and reset form
      setShowAddModal(false);
      setFormData({
        consultantName: '',
        client: '',
        vendor: '',
        marketer: '',
        inhouseEngineer: '',
        technology: '',
        startDate: '',
        endDate: '',
        resume: null,
        timesheet: null,
      });

      // Notify about the assignment
      const assignedUser = users.find(user => user.id === formData.inhouseEngineer);
      if (assignedUser) {
        toast.success(`Offer assigned to ${assignedUser.name}`);
      }

      console.log('Form submission completed successfully'); // Debug log

    } catch (error) {
      console.error('Error generating offer:', error);
      toast.error('Failed to generate offer');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'resume' | 'timesheet') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const filteredOffers = offers?.filter(offer => 
    offer.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.inhouseEngineer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Add function to update offer status
  const updateOfferStatus = async (offerId: string, newStatus: GeneratedOffer['status']) => {
    try {
      // Try to update in API first
      await axios.patch(`/api/offers/${offerId}`, { status: newStatus });
      
      // Update in localStorage and state
      const updatedOffers = offers.map(offer => 
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      );
      localStorage.setItem('generatedOffers', JSON.stringify(updatedOffers));
      setOffers(updatedOffers);

      // Update in user's offers
      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        const userOffersKey = `userOffers_${offer.inhouseEngineer}`;
        const userOffers = JSON.parse(localStorage.getItem(userOffersKey) || '[]');
        const updatedUserOffers = userOffers.map((o: GeneratedOffer) =>
          o.id === offerId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem(userOffersKey, JSON.stringify(updatedUserOffers));
      }

      toast.success('Offer status updated successfully');
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast.error('Failed to update offer status');
    }
  };

  // Function to handle editing an offer
  const handleEditOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    try {
      const updatedOffer = {
        ...selectedOffer,
        consultantName: editFormData.consultantName,
        client: editFormData.client,
        vendor: editFormData.vendor,
        marketer: editFormData.marketer,
        inhouseEngineer: editFormData.inhouseEngineer,
        technology: editFormData.technology,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate || undefined,
        resume: editFormData.resume ? editFormData.resume.name : selectedOffer.resume,
        timesheet: editFormData.timesheet ? editFormData.timesheet.name : selectedOffer.timesheet,
      };

      try {
        // Try to update in API first
        await axios.put(`/api/offers/${selectedOffer.id}`, updatedOffer);
      } catch (error) {
        console.error('API update failed:', error);
      }

      // Update in localStorage and state
      const updatedOffers = offers.map(offer =>
        offer.id === selectedOffer.id ? updatedOffer : offer
      );
      localStorage.setItem('generatedOffers', JSON.stringify(updatedOffers));
      setOffers(updatedOffers);

      // Update in user's offers
      const userOffersKey = `userOffers_${updatedOffer.inhouseEngineer}`;
      const userOffers = JSON.parse(localStorage.getItem(userOffersKey) || '[]');
      const updatedUserOffers = userOffers.map((o: GeneratedOffer) =>
        o.id === selectedOffer.id ? updatedOffer : o
      );
      localStorage.setItem(userOffersKey, JSON.stringify(updatedUserOffers));

      toast.success('Offer updated successfully');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Failed to update offer');
    }
  };

  // Function to open edit modal
  const openEditModal = (offer: GeneratedOffer) => {
    setSelectedOffer(offer);
    setEditFormData({
      consultantName: offer.consultantName,
      client: offer.client,
      vendor: offer.vendor,
      marketer: offer.marketer,
      inhouseEngineer: offer.inhouseEngineer,
      technology: offer.technology,
      startDate: offer.startDate,
      endDate: offer.endDate || '',
      resume: null,
      timesheet: null,
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Generated Offers</h1>
          <p className="text-gray-400">Create and manage offers for users</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          Generate New Offer
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Generated Offers</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search offers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {filteredOffers.length > 0 ? (
              filteredOffers.map(offer => (
                <div 
                  key={offer.id}
                  className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800/70"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{offer.consultantName}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{offer.client}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => {
                          setSelectedOffer(offer);
                          setShowDetailsModal(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => openEditModal(offer)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Badge
                        variant={
                          offer.status === 'accepted' ? 'success' :
                          offer.status === 'rejected' ? 'danger' :
                          offer.status === 'ongoing' ? 'warning' :
                          offer.status === 'completed' ? 'primary' :
                          'default'
                        }
                        className={
                          offer.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                          offer.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                          offer.status === 'ongoing' ? 'bg-yellow-500/10 text-yellow-500' :
                          offer.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-gray-500/10 text-gray-500'
                        }
                      >
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4 mr-2 opacity-70" />
                        <span>Engineer: {offer.inhouseEngineer}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <FileText className="w-4 h-4 mr-2 opacity-70" />
                        <span>Technology: {offer.technology}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 opacity-70" />
                        <span>Start Date: {new Date(offer.startDate).toLocaleDateString()}</span>
                      </div>
                      {offer.endDate && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2 opacity-70" />
                          <span>End Date: {new Date(offer.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No offers found
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Generate New Offer"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Consultant Name
              </label>
              <Input
                name="consultantName"
                value={formData.consultantName}
                onChange={handleInputChange}
                placeholder="Enter consultant's full name"
                required
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Client
              </label>
              <select
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500"
              >
                <option value="">Select client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.companyName} - {client.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Vendor
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500"
              >
                <option value="">Select vendor...</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.companyName} - {vendor.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Technology
              </label>
              <Input
                name="technology"
                value={formData.technology}
                onChange={handleInputChange}
                placeholder="Enter technology"
                required
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Inhouse Engineer
              </label>
              <select
                name="inhouseEngineer"
                value={formData.inhouseEngineer}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2 focus:border-purple-500"
              >
                <option value="">Select Inhouse Engineer</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Marketer
              </label>
              <Input
                name="marketer"
                value={formData.marketer}
                onChange={handleInputChange}
                placeholder="Enter marketer's name"
                required
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800 border-gray-700 text-white focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                End Date (Optional)
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border-gray-700 text-white focus:border-purple-500"
              />
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Resume (Required)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  required
                  className="w-full bg-gray-800 border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
                {formData.resume && (
                  <span className="text-sm text-gray-400">
                    {formData.resume.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Accepted formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Timesheet (Optional)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.xls,.xlsx"
                  onChange={(e) => handleFileChange(e, 'timesheet')}
                  className="w-full bg-gray-800 border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
                {formData.timesheet && (
                  <span className="text-sm text-gray-400">
                    {formData.timesheet.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Accepted formats: PDF, XLS, XLSX (Max 10MB)
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-6 py-3 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Generate Offer
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {showDetailsModal && selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Offer Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Consultant Name</h3>
                  <p className="text-white">{selectedOffer.consultantName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Client</h3>
                  <p className="text-white">{selectedOffer.client}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Vendor</h3>
                  <p className="text-white">{selectedOffer.vendor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Technology</h3>
                  <p className="text-white">{selectedOffer.technology}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Inhouse Engineer</h3>
                  <p className="text-white">{selectedOffer.inhouseEngineer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Marketer</h3>
                  <p className="text-white">{selectedOffer.marketer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Start Date</h3>
                  <p className="text-white">{new Date(selectedOffer.startDate).toLocaleDateString()}</p>
                </div>
                {selectedOffer.endDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">End Date</h3>
                    <p className="text-white">{new Date(selectedOffer.endDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
                <Badge
                  variant={
                    selectedOffer.status === 'accepted' ? 'success' :
                    selectedOffer.status === 'rejected' ? 'danger' :
                    selectedOffer.status === 'ongoing' ? 'warning' :
                    selectedOffer.status === 'completed' ? 'primary' :
                    'default'
                  }
                >
                  {selectedOffer.status.charAt(0).toUpperCase() + selectedOffer.status.slice(1)}
                </Badge>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Attached Files</h3>
                <div className="space-y-2">
                  {selectedOffer.resume && (
                    <div className="flex items-center text-purple-400">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Resume: {selectedOffer.resume}</span>
                    </div>
                  )}
                  {selectedOffer.timesheet && (
                    <div className="flex items-center text-purple-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Timesheet: {selectedOffer.timesheet}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Offer</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditOffer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Consultant Name
                  </label>
                  <Input
                    name="consultantName"
                    value={editFormData.consultantName}
                    onChange={(e) => setEditFormData({ ...editFormData, consultantName: e.target.value })}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Client
                  </label>
                  <Input
                    name="client"
                    value={editFormData.client}
                    onChange={(e) => setEditFormData({ ...editFormData, client: e.target.value })}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Vendor
                  </label>
                  <Input
                    name="vendor"
                    value={editFormData.vendor}
                    onChange={(e) => setEditFormData({ ...editFormData, vendor: e.target.value })}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Technology
                  </label>
                  <Input
                    name="technology"
                    value={editFormData.technology}
                    onChange={(e) => setEditFormData({ ...editFormData, technology: e.target.value })}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Marketer
                  </label>
                  <Input
                    name="marketer"
                    value={editFormData.marketer}
                    onChange={(e) => setEditFormData({ ...editFormData, marketer: e.target.value })}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Inhouse Engineer
                  </label>
                  <select
                    name="inhouseEngineer"
                    value={editFormData.inhouseEngineer}
                    onChange={(e) => setEditFormData({ ...editFormData, inhouseEngineer: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    required
                  >
                    <option value="" className="bg-gray-800">Select Engineer</option>
                    {users.map(user => (
                      <option 
                        key={user.id} 
                        value={user.id}
                        className="bg-gray-800"
                      >
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    name="startDate"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    End Date (Optional)
                  </label>
                  <Input
                    type="date"
                    name="endDate"
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferGenerated; 
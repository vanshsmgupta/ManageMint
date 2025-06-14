import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Pencil, Play, Download, X, Calendar, FileText, Link as LinkIcon, Trash, MessageCircle } from 'lucide-react';
import Modal from '../../components/Modal';

interface Offer {
  id: string;
  consultantName: string;
  client: string;
  vendor: string;
  marketer: string;
  inhouseEngineer: string;
  technology: string;
  startDate: string;
  endDate: string;
  resume: string;
  timesheet: string;
  status: 'ongoing' | 'pending';
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

const Offers = () => {
  const [consultantFilter, setConsultantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectTypeFilter, setProjectTypeFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<'my' | 'team'>('my');
  const [showAddModal, setShowAddModal] = useState(false);
  const [offers, setOffers] = useState<Offer[]>(() => {
    const savedOffers = localStorage.getItem('offers');
    return savedOffers ? JSON.parse(savedOffers) : [];
  });
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
    timesheet: null
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

  // Save offers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('offers', JSON.stringify(offers));
  }, [offers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOffer: Offer = {
      id: Date.now().toString(),
      consultantName: formData.consultantName,
      client: formData.client,
      vendor: formData.vendor,
      marketer: formData.marketer,
      inhouseEngineer: formData.inhouseEngineer,
      technology: formData.technology,
      startDate: formData.startDate,
      endDate: formData.endDate,
      resume: formData.resume?.name || '',
      timesheet: formData.timesheet?.name || '',
      status: 'pending'
    };

    setOffers(prev => [...prev, newOffer]);
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
      timesheet: null
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'joining pending':
        return 'text-blue-400';
      case 'ongoing':
        return 'text-green-400';
      case 'never started':
        return 'text-red-400';
      case 'terminated':
        return 'text-red-400';
      case 'completed':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleDownload = () => {
    // Implement download logic
    console.log('Downloading offers');
  };

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Offers</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">Offers</span>
            <span className="text-gray-500">→</span>
            <span className="text-xs text-gray-400">List</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-white"
            title="Download Offers"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Consultant"
            value={consultantFilter}
            onChange={(e) => setConsultantFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
        </select>
        <select
          value={projectTypeFilter}
          onChange={(e) => setProjectTypeFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Project Type</option>
        </select>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Created By"
            value={createdByFilter}
            onChange={(e) => setCreatedByFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Vendor"
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
              type="text"
            placeholder="Client"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
            />
          </div>
          <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
          />
          </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center gap-1.5"
            onClick={() => console.log('Applying filters')}
          >
            Apply
            <Search className="w-3 h-3" />
          </button>
          <button 
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            Add New
          </button>
                  </div>
                </div>

      {/* Offer Type Toggle */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveFilter('my')}
          className={`px-3 py-1.5 text-xs ${
            activeFilter === 'my'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          My Offers
        </button>
        <button
          onClick={() => setActiveFilter('team')}
          className={`px-3 py-1.5 text-xs ${
            activeFilter === 'team'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Team Offers
        </button>
              </div>

      {/* Offers Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Consultant</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vendor</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marketer</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Engineer</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Technology</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">End Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-700/20">
                  <td className="px-3 py-2">
                    <span className="text-xs text-blue-400 hover:underline cursor-pointer">
                      {offer.consultantName}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{offer.client}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{offer.vendor}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{offer.marketer}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{offer.inhouseEngineer}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{offer.technology}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{offer.startDate}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{offer.endDate}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="Join Meeting">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              </div>
            </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>0 of 0 items</span>
        <button className="px-2 py-1 rounded hover:bg-gray-700">←</button>
        <span>0</span>
        <span>/</span>
        <span>0</span>
        <button className="px-2 py-1 rounded hover:bg-gray-700">→</button>
      </div>

      {/* Add Offer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Offer"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Consultant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="consultantName"
                value={formData.consultantName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
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
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
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
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Marketer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="marketer"
                value={formData.marketer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                In-house Engineer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="inhouseEngineer"
                value={formData.inhouseEngineer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Technology <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="technology"
                value={formData.technology}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Resume <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="resume"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, resume: file }));
                  }
                }}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Timesheet
              </label>
              <input
                type="file"
                name="timesheet"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, timesheet: file }));
                  }
                }}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
            >
              Add Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Offers;
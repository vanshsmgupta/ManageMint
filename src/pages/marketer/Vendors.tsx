import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Download, X } from 'lucide-react';
import Modal from '../../components/Modal';

interface Vendor {
  id: string;
  companyName: string;
  addedDate: string;
  website: string;
  email: string;
  type: string;
  street: string;
  city: string;
  state: string;
}

interface VendorFormData {
  companyName: string;
  website: string;
  email: string;
  type: string;
  street: string;
  city: string;
  state: string;
}

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const savedVendors = localStorage.getItem('vendors');
    return savedVendors ? JSON.parse(savedVendors) : [];
  });
  const [formData, setFormData] = useState<VendorFormData>({
    companyName: '',
    website: '',
    email: '',
    type: 'vendor',
    street: '',
    city: '',
    state: ''
  });
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Vendor, 'id' | 'addedDate'>>({
    companyName: '',
    website: '',
    email: '',
    type: 'vendor',
    street: '',
    city: '',
    state: ''
  });

  // Save vendors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor: Vendor = {
      id: Date.now().toString(),
      ...formData,
      addedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
    setVendors(prev => [...prev, newVendor]);
    setShowAddModal(false);
    setFormData({
      companyName: '',
      website: '',
      email: '',
      type: 'vendor',
      street: '',
      city: '',
      state: ''
    });
  };

  const handleEditClick = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditFormData({
      companyName: vendor.companyName,
      website: vendor.website,
      email: vendor.email,
      type: vendor.type,
      street: vendor.street,
      city: vendor.city,
      state: vendor.state
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;

    const updatedVendor: Vendor = {
      ...editingVendor,
      ...editFormData
    };

    setVendors(prev => prev.map(v => v.id === editingVendor.id ? updatedVendor : v));
    setEditingVendor(null);
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    // Implement download logic
    console.log('Downloading vendors');
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Vendor</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">Vendor</span>
            <span className="text-gray-500">→</span>
            <span className="text-xs text-gray-400">List</span>
          </div>
        </div>
      </div>

      {/* Search and Add New section */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search by complete email and phone number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300 placeholder-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center gap-2"
        >
          Add New
        </button>
      </div>

      {/* Vendors Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Added Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Website</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Street</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">City</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">State</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-700/20">
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{vendor.companyName}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{vendor.addedDate}</span>
                  </td>
                  <td className="px-4 py-2">
                    {vendor.website ? (
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                        {vendor.website}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-blue-400 hover:underline cursor-pointer">{vendor.email}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{vendor.type}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{vendor.street}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{vendor.city}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{vendor.state}</span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditClick(vendor)}
                        className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" 
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="Download">
                        <Download className="w-4 h-4" />
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
      <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg px-4 py-2">
          <span>{filteredVendors.length} of {vendors.length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded hover:bg-gray-700">←</button>
          <span>{vendors.length > 0 ? 1 : 0}</span>
          <span>/</span>
          <span>{Math.ceil(vendors.length / 10)}</span>
          <button className="px-2 py-1 rounded hover:bg-gray-700">→</button>
        </div>
      </div>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Vendor"
      >
        <form onSubmit={handleAddVendor}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Select type...</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
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
              Add Vendor
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingVendor && (
        <Modal title="Edit Vendor" isOpen={true} onClose={() => setEditingVendor(null)}>
          <form onSubmit={handleEditVendor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={editFormData.companyName}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={editFormData.website}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={editFormData.street}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={editFormData.city}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={editFormData.state}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditingVendor(null)}
                className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Vendors; 
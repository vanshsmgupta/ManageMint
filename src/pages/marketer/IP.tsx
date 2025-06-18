import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Download, X } from 'lucide-react';
import Modal from '../../components/Modal';

interface IP {
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

interface IPFormData {
  companyName: string;
  website: string;
  email: string;
  type: string;
  street: string;
  city: string;
  state: string;
}

const IP = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [ips, setIPs] = useState<IP[]>(() => {
    const savedIPs = localStorage.getItem('implementationPartners');
    return savedIPs ? JSON.parse(savedIPs) : [];
  });
  const [formData, setFormData] = useState<IPFormData>({
    companyName: '',
    website: '',
    email: '',
    type: '',
    street: '',
    city: '',
    state: ''
  });
  const [editingIP, setEditingIP] = useState<IP | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<IP, 'id' | 'addedDate'>>({
    companyName: '',
    website: '',
    email: '',
    type: 'ip',
    street: '',
    city: '',
    state: ''
  });

  // Save IPs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('implementationPartners', JSON.stringify(ips));
  }, [ips]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddIP = (e: React.FormEvent) => {
    e.preventDefault();
    const newIP: IP = {
      id: Date.now().toString(),
      ...formData,
      addedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
    setIPs(prev => [...prev, newIP]);
    setShowAddModal(false);
    setFormData({
      companyName: '',
      website: '',
      email: '',
      type: '',
      street: '',
      city: '',
      state: ''
    });
  };

  const handleEditClick = (ip: IP) => {
    setEditingIP(ip);
    setEditFormData({
      companyName: ip.companyName,
      website: ip.website,
      email: ip.email,
      type: ip.type,
      street: ip.street,
      city: ip.city,
      state: ip.state
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIP) return;

    const updatedIP: IP = {
      ...editingIP,
      ...editFormData
    };

    setIPs(prev => prev.map(i => i.id === editingIP.id ? updatedIP : i));
    setEditingIP(null);
  };

  const filteredIPs = ips.filter(ip => 
    ip.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Implementation Partner</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">Implementation Partner</span>
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

      {/* IPs Table */}
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
              {filteredIPs.map((ip) => (
                <tr key={ip.id} className="hover:bg-gray-700/20">
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{ip.companyName}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{ip.addedDate}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-blue-400 hover:underline cursor-pointer">{ip.website}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-blue-400 hover:underline cursor-pointer">{ip.email}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{ip.type}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{ip.street}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{ip.city}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{ip.state}</span>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleEditClick(ip)}
                      className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" 
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
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
          <span>{filteredIPs.length} of {ips.length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded hover:bg-gray-700">←</button>
          <span>{ips.length > 0 ? 1 : 0}</span>
          <span>/</span>
          <span>{Math.ceil(ips.length / 10)}</span>
          <button className="px-2 py-1 rounded hover:bg-gray-700">→</button>
        </div>
      </div>

      {/* Add IP Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Implementation Partner"
      >
        <form onSubmit={handleAddIP}>
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
                <option value="implementation_partner">Implementation Partner</option>
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
              Add Implementation Partner
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingIP && (
        <Modal title="Edit IP" isOpen={true} onClose={() => setEditingIP(null)}>
          <form onSubmit={handleEditIP} className="space-y-4">
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
                onClick={() => setEditingIP(null)}
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

export default IP; 
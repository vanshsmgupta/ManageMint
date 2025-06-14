import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, X } from 'lucide-react';
import Modal from '../../components/Modal';

interface Client {
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

interface ClientFormData {
  companyName: string;
  website: string;
  email: string;
  type: string;
  street: string;
  city: string;
  state: string;
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: '',
    website: '',
    email: '',
    type: 'client',
    street: '',
    city: '',
    state: ''
  });

  // Save clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Date.now().toString(),
      ...formData,
      addedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
    setClients(prev => [...prev, newClient]);
    setShowAddModal(false);
    setFormData({
      companyName: '',
      website: '',
      email: '',
      type: 'client',
      street: '',
      city: '',
      state: ''
    });
  };

  const filteredClients = clients.filter(client => 
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Client</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">Client</span>
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

      {/* Clients Table */}
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
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-700/20">
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{client.companyName}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{client.addedDate}</span>
                  </td>
                  <td className="px-4 py-2">
                    {client.website ? (
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                        {client.website}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-blue-400 hover:underline cursor-pointer">{client.email}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{client.type}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{client.street}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{client.city}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{client.state}</span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="Edit">
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
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>0 of 0 items</span>
        <button className="px-2 py-1 rounded hover:bg-gray-700">←</button>
        <span>0</span>
        <span>/</span>
        <span>0</span>
        <button className="px-2 py-1 rounded hover:bg-gray-700">→</button>
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Client"
      >
        <form onSubmit={handleAddClient}>
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
                <option value="client">Client</option>
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
              Add Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients; 
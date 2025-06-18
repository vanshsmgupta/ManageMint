import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, X } from 'lucide-react';
import Modal from '../../components/Modal';

interface POC {
  id: string;
  contactName: string;
  addedDate: string;
  phone: string;
  alternatePhone: string;
  email: string;
  type: string;
  position: string;
  client: string;
}

interface POCFormData {
  contactName: string;
  phone: string;
  alternatePhone: string;
  email: string;
  type: string;
  position: string;
  client: string;
}

const POCs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'billing' | 'time-sheet' | 'recruiter' | 'other'>('recruiter');
  const [pocs, setPOCs] = useState<POC[]>(() => {
    const savedPOCs = localStorage.getItem('pocs');
    return savedPOCs ? JSON.parse(savedPOCs) : [];
  });
  const [formData, setFormData] = useState<POCFormData>({
    contactName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    type: '',
    position: '',
    client: ''
  });
  const [editingPOC, setEditingPOC] = useState<POC | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<POC, 'id' | 'addedDate'>>({
    contactName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    type: '',
    position: '',
    client: ''
  });

  // Save POCs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pocs', JSON.stringify(pocs));
  }, [pocs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPOC = (e: React.FormEvent) => {
    e.preventDefault();
    const newPOC: POC = {
      id: Date.now().toString(),
      ...formData,
      addedDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
    setPOCs(prev => [...prev, newPOC]);
    setShowAddModal(false);
    setFormData({
      contactName: '',
      phone: '',
      alternatePhone: '',
      email: '',
      type: '',
      position: '',
      client: ''
    });
  };

  const handleEditClick = (poc: POC) => {
    setEditingPOC(poc);
    setEditFormData({
      contactName: poc.contactName,
      phone: poc.phone,
      alternatePhone: poc.alternatePhone,
      email: poc.email,
      type: poc.type,
      position: poc.position,
      client: poc.client
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditPOC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPOC) return;

    const updatedPOC: POC = {
      ...editingPOC,
      ...editFormData
    };

    setPOCs(prev => prev.map(p => p.id === editingPOC.id ? updatedPOC : p));
    setEditingPOC(null);
  };

  const filteredPOCs = pocs.filter(poc => {
    const matchesTab = poc.type.toLowerCase() === activeTab;
    const matchesSearch = 
      poc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poc.phone.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">POCs</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">POCs</span>
            <span className="text-gray-500">→</span>
            <span className="text-xs text-gray-400">List</span>
          </div>
        </div>
      </div>

      {/* Search and Tabs section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
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

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 text-xs rounded-lg ${
              activeTab === 'billing'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('time-sheet')}
            className={`px-4 py-2 text-xs rounded-lg ${
              activeTab === 'time-sheet'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Time-sheet
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-4 py-2 text-xs rounded-lg ${
              activeTab === 'recruiter'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Recruiter
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`px-4 py-2 text-xs rounded-lg ${
              activeTab === 'other'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Other
          </button>
        </div>
      </div>

      {/* POCs Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Added Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Alternate phone number</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredPOCs.map((poc) => (
                <tr key={poc.id} className="hover:bg-gray-700/20">
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{poc.contactName}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{poc.addedDate}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{poc.phone}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{poc.alternatePhone}</span>
                  </td>
                  <td className="px-4 py-2">
                    {poc.email !== '-' ? (
                      <span className="text-xs text-blue-400 hover:underline cursor-pointer">
                        {poc.email}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{poc.type}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{poc.position}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-gray-300">{poc.client}</span>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleEditClick(poc)}
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
          <span>{filteredPOCs.length} of {pocs.length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded hover:bg-gray-700">←</button>
          <span>{pocs.length > 0 ? 1 : 0}</span>
          <span>/</span>
          <span>{Math.ceil(pocs.length / 10)}</span>
          <button className="px-2 py-1 rounded hover:bg-gray-700">→</button>
        </div>
      </div>

      {/* Add POC Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New POC"
      >
        <form onSubmit={handleAddPOC}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Alternate Phone Number
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
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
                <option value="recruiter">Recruiter</option>
                <option value="billing">Billing</option>
                <option value="time-sheet">Time-sheet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
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
              Add POC
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingPOC && (
        <Modal title="Edit POC" isOpen={true} onClose={() => setEditingPOC(null)}>
          <form onSubmit={handleEditPOC} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={editFormData.contactName}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={editFormData.alternatePhone}
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
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={editFormData.position}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="client"
                  value={editFormData.client}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditingPOC(null)}
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

export default POCs; 
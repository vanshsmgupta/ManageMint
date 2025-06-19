import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Consultant {
  id: string;
  name: string;
  phone: string;
  usEntry: string;
  ssn: string;
  status: string;
  assignedMarketer: string;
  createdAt: string;
  createdBy: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant | null;
  onSave: (updatedConsultant: Consultant) => void;
  marketers: any[];
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, consultant, onSave, marketers }) => {
  const [formData, setFormData] = useState<Consultant | null>(null);

  useEffect(() => {
    setFormData(consultant);
  }, [consultant]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Edit Consultant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">US Entry Date</label>
              <input
                type="date"
                name="usEntry"
                value={formData.usEntry}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">SSN</label>
              <input
                type="text"
                name="ssn"
                value={formData.ssn}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Assigned To</label>
              <select
                name="assignedMarketer"
                value={formData.assignedMarketer}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              >
                {marketers.map((marketer) => (
                  <option key={marketer.id} value={marketer.id}>
                    {marketer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Consultants = () => {
  const navigate = useNavigate();
  const { user, isTeamLead } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [marketers, setMarketers] = useState<any[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  // Load consultants and marketers from localStorage
  useEffect(() => {
    const storedConsultants = JSON.parse(localStorage.getItem('consultants') || '[]');
    const storedMarketers = JSON.parse(localStorage.getItem('marketers') || '[]');
    
    setMarketers(storedMarketers);

    // Filter consultants based on user role
    if (isTeamLead) {
      // Team leads can see all consultants assigned to their team's marketers
      const teamMarketers = storedMarketers.filter((m: any) => !m.isTeamLead).map((m: any) => m.id);
      const teamConsultants = storedConsultants.filter((c: Consultant) => 
        teamMarketers.includes(c.assignedMarketer)
      );
      setConsultants(teamConsultants);
    } else {
      // Regular marketers can only see their assigned consultants
      const myConsultants = storedConsultants.filter((c: Consultant) => 
        c.assignedMarketer === user?.id
      );
      setConsultants(myConsultants);
    }
  }, [isTeamLead, user?.id]);

  const getMarketerName = (marketerId: string) => {
    const marketer = marketers.find(m => m.id === marketerId);
    return marketer ? marketer.name : 'Unassigned';
  };

  const handleStatusToggle = (consultant: Consultant) => {
    const updatedConsultant = {
      ...consultant,
      status: consultant.status === 'active' ? 'inactive' : 'active'
    };
    handleConsultantUpdate(updatedConsultant);
  };

  const handleConsultantUpdate = (updatedConsultant: Consultant) => {
    // Update in localStorage
    const allConsultants = JSON.parse(localStorage.getItem('consultants') || '[]');
    const updatedConsultants = allConsultants.map((c: Consultant) =>
      c.id === updatedConsultant.id ? updatedConsultant : c
    );
    localStorage.setItem('consultants', JSON.stringify(updatedConsultants));

    // Update in state
    setConsultants(prev =>
      prev.map(c => (c.id === updatedConsultant.id ? updatedConsultant : c))
    );
  };

  const handleEdit = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setEditModalOpen(true);
  };

  const filteredConsultants = consultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultant.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultant.usEntry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Consultants</h1>
          <p className="text-sm text-gray-400">
            {isTeamLead ? "Manage your team's consultants" : "View your assigned consultants"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search consultants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-64"
            />
          </div>
          {isTeamLead && (
            <button
              onClick={() => navigate('/marketer/add-consultant')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <UserPlus size={16} />
              Add Consultant
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">US Entry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SSN</th>
                {isTeamLead && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Assigned To
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                {isTeamLead && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredConsultants.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-gray-700/20">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-white">{consultant.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.phone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.usEntry}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.ssn}</span>
                  </td>
                  {isTeamLead && (
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-300">
                        {getMarketerName(consultant.assignedMarketer)}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    {isTeamLead ? (
                      <button
                        onClick={() => handleStatusToggle(consultant)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          consultant.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {consultant.status}
                      </button>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        consultant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {consultant.status}
                      </span>
                    )}
                  </td>
                  {isTeamLead && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(consultant)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedConsultant(null);
        }}
        consultant={selectedConsultant}
        onSave={handleConsultantUpdate}
        marketers={marketers.filter(m => !m.isTeamLead)}
      />
    </div>
  );
};

export default Consultants; 
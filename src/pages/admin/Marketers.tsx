import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Key, Mail, Briefcase, Calendar, User as UserIcon } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import Modal from '../../components/ui/Modal';
import { sendPasswordEmail, testEmailService } from '../../services/emailService';
import { useMarketers } from '../../context/MarketerContext';

interface Marketer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  specialization: string;
  clients: number;
  joinDate: string;
  tempPassword?: string;
  createdAt: string;
  isTeamLead: boolean;
  role: 'admin' | 'marketer' | 'team_lead';
}

interface NewMarketer {
  name: string;
  email: string;
  specialization: string;
  joinDate: string;
  isTeamLead: boolean;
}

interface Offer {
  id: string;
  title: string;
  company: string;
  status: 'ongoing' | 'completed' | 'pending';
  startDate: string;
  endDate?: string;
  rate: number;
}

const Marketers = () => {
  const { marketers: contextMarketers, updateMarketer, deleteMarketer, addMarketer } = useMarketers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState('');
  const [selectedMarketer, setSelectedMarketer] = useState<Marketer | null>(null);
  const [marketerOffers, setMarketerOffers] = useState<Offer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [newMarketer, setNewMarketer] = useState<NewMarketer>({
    name: '',
    email: '',
    specialization: 'Workday',
    joinDate: new Date().toISOString().split('T')[0],
    isTeamLead: false
  });
  
  // Load marketers from localStorage on component mount
  const [marketers, setMarketers] = useState<Marketer[]>(() => {
    const savedMarketers = localStorage.getItem('marketers');
    return savedMarketers ? JSON.parse(savedMarketers) : [];
  });

  // Update local state when context marketers change
  useEffect(() => {
    setMarketers(contextMarketers);
  }, [contextMarketers]);

  // Save marketers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('marketers', JSON.stringify(marketers));
  }, [marketers]);

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddMarketer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { marketer, tempPassword } = addMarketer({
        name: newMarketer.name,
        email: newMarketer.email,
        specialization: newMarketer.specialization,
        joinDate: newMarketer.joinDate,
        clients: 0,
        isTeamLead: newMarketer.isTeamLead,
        role: newMarketer.isTeamLead ? 'team_lead' : 'marketer'
      });

      // Send password email
      const emailSent = await sendPasswordEmail(
        newMarketer.email,
        newMarketer.name,
        tempPassword
      );

      // Update marketers in localStorage with team lead status
      const updatedMarketer = {
        ...marketer,
        isTeamLead: newMarketer.isTeamLead
      };
      setMarketers(prev => [...prev, updatedMarketer]);
      localStorage.setItem('marketers', JSON.stringify([...marketers, updatedMarketer]));

      setShowAddModal(false);

      if (emailSent) {
        alert('Marketer created successfully! Password has been sent to their email.');
      } else {
        setSelectedPassword(tempPassword);
        setShowPasswordModal(true);
        alert('Marketer created successfully, but there was an error sending the password email. Please provide the password manually.');
      }

      setNewMarketer({
        name: '',
        email: '',
        specialization: 'Workday',
        joinDate: new Date().toISOString().split('T')[0],
        isTeamLead: false
      });
    } catch (error) {
      console.error('Error creating marketer:', error);
      alert('Error creating marketer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMarketer = (marketerId: string) => {
    if (window.confirm('Are you sure you want to delete this marketer?')) {
      deleteMarketer(marketerId);
    }
  };

  const toggleMarketerStatus = (marketerId: string) => {
    const marketer = marketers.find(m => m.id === marketerId);
    if (marketer) {
      const newStatus = marketer.status === 'active' ? 'inactive' : 'active';
      
      // Update in context
      updateMarketer(marketerId, { status: newStatus });
      
      // Update local state
      setMarketers(prevMarketers => 
        prevMarketers.map(m => 
          m.id === marketerId ? { ...m, status: newStatus } : m
        )
      );
      
      // Update selected marketer if it's currently being viewed
      if (selectedMarketer && selectedMarketer.id === marketerId) {
        setSelectedMarketer(prev => prev ? { ...prev, status: newStatus } : null);
      }

      // Update localStorage
      const updatedMarketers = marketers.map(m =>
        m.id === marketerId ? { ...m, status: newStatus } : m
      );
      localStorage.setItem('marketers', JSON.stringify(updatedMarketers));
    }
  };

  const showMarketerPassword = (password: string) => {
    setSelectedPassword(password);
    setShowPasswordModal(true);
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    try {
      const success = await testEmailService();
      if (success) {
        alert('Test email sent successfully! Please check your inbox (and spam folder).');
      } else {
        alert('Failed to send test email. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error testing email service:', error);
      alert('Error testing email service. Please check the console for details.');
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleMarketerClick = (marketer: Marketer) => {
    setSelectedMarketer(marketer);
    // Get marketer's offers from localStorage
    const offers = JSON.parse(localStorage.getItem(`offers_${marketer.id}`) || '[]');
    setMarketerOffers(offers);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredMarketers = contextMarketers.filter(marketer =>
    marketer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marketer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTeamLeadStatus = (marketerId: string) => {
    const marketer = marketers.find(m => m.id === marketerId);
    if (marketer) {
      const updatedMarketers = marketers.map(m => {
        if (m.id === marketerId) {
          return {
            ...m,
            isTeamLead: !m.isTeamLead,
            role: !m.isTeamLead ? 'team_lead' : 'marketer'
          };
        }
        return m;
      });
      setMarketers(updatedMarketers);
      localStorage.setItem('marketers', JSON.stringify(updatedMarketers));
      
      // Update the selected marketer if it's currently being viewed
      if (selectedMarketer && selectedMarketer.id === marketerId) {
        setSelectedMarketer({
          ...selectedMarketer,
          isTeamLead: !selectedMarketer.isTeamLead,
          role: !selectedMarketer.isTeamLead ? 'team_lead' : 'marketer'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketers</h1>
          <p className="text-gray-400">Add, edit, and manage marketer accounts</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleTestEmail}
            disabled={isTestingEmail}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Mail className="w-4 h-4" />
            <span>{isTestingEmail ? 'Sending...' : 'Test Email'}</span>
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Marketer
          </Button>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team Lead</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {marketers.map((marketer) => (
                <tr key={marketer.id} className="hover:bg-gray-700/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={`https://i.pravatar.cc/40?u=${marketer.id}`}
                        alt={marketer.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <button 
                        onClick={() => handleMarketerClick(marketer)}
                        className="font-medium text-white hover:text-blue-400 transition-colors"
                      >
                        {marketer.name}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{marketer.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleMarketerStatus(marketer.id)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        marketer.status === 'active'
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {marketer.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{marketer.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleTeamLeadStatus(marketer.id)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        marketer.isTeamLead
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {marketer.isTeamLead ? 'Team Lead' : 'Make Team Lead'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleMarketerClick(marketer)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMarketer(marketer.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Marketer"
      >
        <form onSubmit={handleAddMarketer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
            <Input
              type="text"
              required
              value={newMarketer.name}
              onChange={(e) => setNewMarketer({ ...newMarketer, name: e.target.value })}
              placeholder="Enter marketer name"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <Input
              type="email"
              required
              value={newMarketer.email}
              onChange={(e) => setNewMarketer({ ...newMarketer, email: e.target.value })}
              placeholder="Enter email address"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Specialization</label>
            <select
              value={newMarketer.specialization}
              onChange={(e) => setNewMarketer({ ...newMarketer, specialization: e.target.value })}
              className="w-full px-3 py-2 bg-white text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Workday">Workday</option>
              <option value="Salesforce">Salesforce</option>
              <option value="Python">Python</option>
              <option value="Full Stack">Full Stack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Join Date</label>
            <Input
              type="date"
              required
              value={newMarketer.joinDate}
              onChange={(e) => setNewMarketer({ ...newMarketer, joinDate: e.target.value })}
              className="bg-white text-black"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="border border-gray-600 text-gray-300 hover:bg-gray-700/50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span>Creating...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <span>Add Marketer</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Temporary Password"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Please save this temporary password. The marketer will need it to log in for the first time:
          </p>
          <div className="p-3 bg-gray-700/50 rounded-md font-mono text-center text-lg text-purple-400">
            {selectedPassword}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setShowPasswordModal(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Marketer Details"
      >
        {selectedMarketer && (
          <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-blue-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white truncate">{selectedMarketer.name}</p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white truncate" title={selectedMarketer.email}>{selectedMarketer.email}</p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-400">Specialization</p>
                  <span className="inline-block px-3 py-1 text-sm text-purple-400 bg-purple-500/20 rounded-full truncate">
                    {selectedMarketer.specialization}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p className="text-white">{formatDate(selectedMarketer.joinDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedMarketer.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedMarketer.status.charAt(0).toUpperCase() + selectedMarketer.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Clients</p>
                  <p className="text-white">{selectedMarketer.clients}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-400" />
                Generated Offers
              </h3>
              <div className="space-y-4">
                {marketerOffers.length > 0 ? (
                  marketerOffers.map((offer) => (
                    <div 
                      key={offer.id}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">{offer.title}</h4>
                          <p className="text-sm text-gray-400">{offer.company}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.status)}`}>
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-400">Start Date</p>
                          <p className="text-white">{formatDate(offer.startDate)}</p>
                        </div>
                        {offer.endDate && (
                          <div>
                            <p className="text-gray-400">End Date</p>
                            <p className="text-white">{formatDate(offer.endDate)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-400">Rate</p>
                          <p className="text-green-400">{formatCurrency(offer.rate)}/hr</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No offers found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Marketers;
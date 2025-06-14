import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Mail, Briefcase, Calendar, User as UserIcon } from 'lucide-react';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useUsers } from '../../context/UserContext';
import { sendPasswordEmail, testEmailService } from '../../services/emailService';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  dob: string;
  doj: string;
  isTeamLead: boolean;
  role: 'user' | 'team_lead' | 'marketer';
}

interface NewUser {
  name: string;
  email: string;
  dateOfBirth: string;
  joinDate: string;
  role: 'user' | 'team_lead' | 'marketer';
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

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userOffers, setUserOffers] = useState<Offer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState('');
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    dateOfBirth: '',
    joinDate: new Date().toISOString().split('T')[0],
    role: 'user',
    isTeamLead: false
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // Get user's offers from localStorage
    const offers = JSON.parse(localStorage.getItem(`offers_${user.id}`) || '[]');
    setUserOffers(offers);
    setShowUserDetailsModal(true);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { user, tempPassword } = addUser({
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dateOfBirth,
        doj: newUser.joinDate,
        role: newUser.isTeamLead ? 'team_lead' : 'user',
        isTeamLead: newUser.isTeamLead
      });
      
      // Send password email
      const emailSent = await sendPasswordEmail(
        newUser.email,
        newUser.name,
        tempPassword
      );

      setShowAddModal(false);

      if (emailSent) {
        alert('User created successfully! Password has been sent to their email.');
      } else {
        setSelectedPassword(tempPassword);
        setShowPasswordModal(true);
        alert('User created successfully, but there was an error sending the password email. Please provide the password manually.');
      }

      setNewUser({
        name: '',
        email: '',
        dateOfBirth: '',
        joinDate: new Date().toISOString().split('T')[0],
        role: 'user',
        isTeamLead: false
      });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const toggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, {
        status: user.status === 'active' ? 'inactive' : 'active'
      });
    }
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Software Development Engineers</h1>
          <p className="text-gray-400">Add, edit, and manage user accounts</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleTestEmail}
            disabled={isTestingEmail}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>{isTestingEmail ? 'Sending...' : 'Test Email'}</span>
          </Button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">All Engineers</h2>
          <div className="relative w-96">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`https://i.pravatar.cc/40?u=${user.id}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <button 
                        onClick={() => handleUserClick(user)}
                        className="font-medium text-white hover:text-blue-400 transition-colors"
                      >
                        {user.name}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-sm ${
                      user.isTeamLead 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    } rounded-full`}>
                      {user.isTeamLead ? 'Team Lead' : 'Engineer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(user.dob).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(user.doj).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300">
              Showing {filteredUsers.length} users
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700/50">
                Previous
              </button>
              <button className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-md">
                1
              </button>
              <button className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700/50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Engineer"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
            <Input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Enter engineer name"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <Input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Enter email address"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Date of Birth</label>
            <Input
              type="date"
              required
              value={newUser.dateOfBirth}
              onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
              className="bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Join Date</label>
            <Input
              type="date"
              required
              value={newUser.joinDate}
              onChange={(e) => setNewUser({ ...newUser, joinDate: e.target.value })}
              className="bg-white text-black"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isTeamLead"
              checked={newUser.isTeamLead}
              onChange={(e) => setNewUser({ ...newUser, isTeamLead: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isTeamLead" className="text-sm font-medium text-gray-300">
              Assign as Team Lead
            </label>
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
                <span>Add Engineer</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-blue-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date of Birth</p>
                  <p className="text-white">{formatDate(selectedUser.dob)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p className="text-white">{formatDate(selectedUser.doj)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedUser.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-400" />
                Ongoing Offers
              </h3>
              <div className="space-y-4">
                {userOffers.length > 0 ? (
                  userOffers.map((offer) => (
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
                    No ongoing offers found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Temporary Password"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Please save this temporary password. The user will need it to log in for the first time:
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
    </div>
  );
};

export default UserManagement; 
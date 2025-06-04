import React from 'react';
import { User, Check, X } from 'lucide-react';
import { useUsers } from '../../context/UserContext';

const PendingApprovals = () => {
  const { users, updateUserStatus } = useUsers();
  const pendingUsers = users.filter(user => user.status === 'pending');

  const handleApprove = (userId: string) => {
    updateUserStatus(userId, 'active');
  };

  const handleReject = (userId: string) => {
    updateUserStatus(userId, 'inactive');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pending Approvals</h1>
        <p className="text-gray-400">Review and manage new user registrations</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {pendingUsers.length} Pending {pendingUsers.length === 1 ? 'Request' : 'Requests'}
          </h2>
        </div>

        <div className="divide-y divide-gray-700">
          {pendingUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No pending approvals at this time
            </div>
          ) : (
            pendingUsers.map(user => (
              <div key={user.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{user.name}</h3>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="text-white mt-1">{user.role}</p>
                  </div>
                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-gray-400">Join Date</p>
                    <p className="text-white mt-1">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-gray-400">Department</p>
                    <p className="text-white mt-1">{user.department || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals; 
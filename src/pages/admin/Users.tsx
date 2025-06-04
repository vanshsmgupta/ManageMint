import React, { useState } from 'react';
import { UserPlus, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUserData: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUserData]);
    setShowAddModal(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Add, edit, and manage user accounts</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2 px-4 py-2 rounded-lg"
          >
            <UserPlus size={16} />
            <span>Add New User</span>
          </Button>
        </div>
      </div>

      <Card className="bg-gray-800/50 backdrop-blur-lg border border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={`https://i.pravatar.cc/40?u=${user.id}`}
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.status === 'active' ? 'success' : 'danger'}
                        className="bg-opacity-20"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="hover:bg-gray-700/50 text-red-400"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-4 text-white">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input 
                label="Name" 
                type="text" 
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
              <Input 
                label="Email" 
                type="email" 
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                  type="button"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Create Account
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Users;
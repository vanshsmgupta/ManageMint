import React from 'react';
import { Users, Search, Plus } from 'lucide-react';

interface Marketer {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const Marketers = () => {
  const [marketers, setMarketers] = React.useState<Marketer[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketers</h1>
          <p className="text-gray-400">View and manage marketers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Marketer
        </button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search marketers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {marketers.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No marketers found</h3>
              <p className="text-gray-400">Get started by adding a new marketer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {marketers.map((marketer) => (
                <div
                  key={marketer.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{marketer.name}</h4>
                      <p className="text-gray-400 text-sm">{marketer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        marketer.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {marketer.status}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Joined {new Date(marketer.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketers; 
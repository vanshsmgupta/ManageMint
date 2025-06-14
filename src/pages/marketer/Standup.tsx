import React from 'react';
import { Users } from 'lucide-react';

const Standup = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Standup</h1>
          <p className="text-gray-400">Daily standup meetings and updates</p>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl p-6">
        <div className="flex items-center text-gray-400">
          <Users className="w-5 h-5 mr-2" />
          <span>Standup content will be implemented here</span>
        </div>
      </div>
    </div>
  );
};

export default Standup; 
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  status: string;
  keySkills: string[];
  usEntry: string;
  ssn: string;
  dob: string;
  marketer: string;
  lastComment: string;
  isTeamConsultant: boolean;
}

interface ActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  consultantId: string;
  formType: 'marketing' | 'submission' | 'assessment' | 'offer';
}

const ActionForm: React.FC<ActionFormProps> = ({ isOpen, onClose, consultantId, formType }) => {
  if (!isOpen) return null;

  const formTitles = {
    marketing: 'Marketing Profile',
    submission: 'Submission Details',
    assessment: 'Assessment Form',
    offer: 'Offer Details'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">{formTitles[formType]}</h2>
        {/* Form content will be implemented based on specific requirements */}
        <div className="space-y-4">
          {/* Placeholder form fields */}
          <div className="space-y-2">
            <label className="text-gray-300">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-300">Description</label>
            <textarea
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Consultants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'marketing' | 'submission' | 'assessment' | 'offer' | null>(null);
  const [activeFilter, setActiveFilter] = useState<'my' | 'team'>('my');

  // Sample data - replace with actual data fetching
  const consultants: Consultant[] = [];

  const handleActionClick = (consultantId: string, formType: 'marketing' | 'submission' | 'assessment' | 'offer') => {
    setSelectedConsultant(consultantId);
    setActiveForm(formType);
  };

  const filteredConsultants = consultants.filter(consultant => {
    const matchesFilter = activeFilter === 'my' ? !consultant.isTeamConsultant : consultant.isTeamConsultant;
    const matchesSearch = consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         consultant.keySkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         consultant.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Consultants</h1>
          <p className="text-sm text-gray-400">Manage consultant profiles and actions</p>
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
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('my')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeFilter === 'my'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              My consultants
            </button>
            <button
              onClick={() => setActiveFilter('team')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeFilter === 'team'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Team's consultants
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Key Skills</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">US Entry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SSN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">DOB</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Marketer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Comment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredConsultants.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-gray-700/20">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-white">{consultant.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {consultant.keySkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.usEntry}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.ssn}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.dob}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.marketer}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-300">{consultant.lastComment}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleActionClick(consultant.id, 'marketing')}
                        className="px-2 py-1 text-xs bg-pink-500/20 text-pink-400 rounded hover:bg-pink-500/30"
                        title="Marketing Profile"
                      >
                        Mp
                      </button>
                      <button
                        onClick={() => handleActionClick(consultant.id, 'submission')}
                        className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30"
                        title="Submissions"
                      >
                        Sub
                      </button>
                      <button
                        onClick={() => handleActionClick(consultant.id, 'assessment')}
                        className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30"
                        title="Assessment"
                      >
                        Int
                      </button>
                      <button
                        onClick={() => handleActionClick(consultant.id, 'offer')}
                        className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                        title="Offer"
                      >
                        Offer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActionForm
        isOpen={!!activeForm}
        onClose={() => {
          setSelectedConsultant(null);
          setActiveForm(null);
        }}
        consultantId={selectedConsultant || ''}
        formType={activeForm || 'marketing'}
      />
    </div>
  );
};

export default Consultants; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ConsultantFormData {
  name: string;
  phone: string;
  usEntry: string;
  ssn: string;
  assignedMarketer: string;
}

interface Marketer {
  id: string;
  name: string;
  email: string;
  isTeamLead: boolean;
}

const AddConsultant = () => {
  const navigate = useNavigate();
  const { isTeamLead } = useAuth();
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [formData, setFormData] = useState<ConsultantFormData>({
    name: '',
    phone: '',
    usEntry: new Date().toISOString().split('T')[0],
    ssn: '',
    assignedMarketer: ''
  });
  const [ssnError, setSsnError] = useState<string>('');

  // Load marketers from localStorage
  useEffect(() => {
    const storedMarketers = localStorage.getItem('marketers');
    if (storedMarketers) {
      const allMarketers = JSON.parse(storedMarketers);
      // Filter out team leads from the assignment options
      const nonTeamLeadMarketers = allMarketers.filter((m: Marketer) => !m.isTeamLead);
      setMarketers(nonTeamLeadMarketers);
    }
  }, []);

  // Redirect if not a team lead
  useEffect(() => {
    if (!isTeamLead) {
      navigate('/marketer/consultants');
    }
  }, [isTeamLead, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'ssn') {
      // Remove any non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      
      // Limit to 9 digits
      const truncatedValue = cleanedValue.slice(0, 9);
      
      // Validate SSN format
      if (truncatedValue.length === 9) {
        setSsnError('');
      } else if (truncatedValue.length > 0) {
        setSsnError('SSN must be exactly 9 digits');
      } else {
        setSsnError('');
      }

      // Format SSN as XXX-XX-XXXX
      let formattedValue = truncatedValue;
      if (truncatedValue.length >= 3) {
        formattedValue = truncatedValue.slice(0, 3) + '-' + truncatedValue.slice(3);
      }
      if (truncatedValue.length >= 5) {
        formattedValue = formattedValue.slice(0, 6) + '-' + formattedValue.slice(6);
      }

      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate SSN before submitting
    const ssnDigits = formData.ssn.replace(/\D/g, '');
    if (ssnDigits.length !== 9) {
      setSsnError('SSN must be exactly 9 digits');
      return;
    }
    
    try {
      // Get existing consultants or initialize empty array
      const consultants = JSON.parse(localStorage.getItem('consultants') || '[]');
      
      const newConsultant = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: 'team_lead'
      };
      
      consultants.push(newConsultant);
      localStorage.setItem('consultants', JSON.stringify(consultants));
      
      // Navigate back to consultants list
      navigate('/marketer/consultants');
    } catch (error) {
      console.error('Error adding consultant:', error);
      alert('Error adding consultant. Please try again.');
    }
  };

  if (!isTeamLead) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Add New Consultant</h1>
        <p className="text-sm text-gray-400">Add a new consultant to your team</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-300">
              Consultant Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="usEntry" className="text-sm font-medium text-gray-300">
              US Entry Date
            </label>
            <input
              type="date"
              id="usEntry"
              name="usEntry"
              required
              value={formData.usEntry}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ssn" className="text-sm font-medium text-gray-300">
              SSN (9 digits)
            </label>
            <input
              type="text"
              id="ssn"
              name="ssn"
              required
              placeholder="XXX-XX-XXXX"
              value={formData.ssn}
              onChange={handleInputChange}
              maxLength={11}
              className={`w-full px-4 py-2 bg-gray-700/50 border ${
                ssnError ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white focus:outline-none focus:border-purple-500`}
            />
            {ssnError && (
              <p className="text-sm text-red-500 mt-1">{ssnError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="assignedMarketer" className="text-sm font-medium text-gray-300">
              Assign to Marketer
            </label>
            <select
              id="assignedMarketer"
              name="assignedMarketer"
              required
              value={formData.assignedMarketer}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">Select a marketer</option>
              {marketers.map((marketer) => (
                <option key={marketer.id} value={marketer.id}>
                  {marketer.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/marketer/consultants')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            disabled={!!ssnError}
          >
            Add Consultant
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddConsultant; 
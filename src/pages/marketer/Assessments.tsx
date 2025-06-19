import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Pencil, Play, Download, X, Calendar, FileText, Link as LinkIcon, Trash, MessageCircle } from 'lucide-react';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

interface Consultant {
  id: string;
  name: string;
  phone: string;
  status: string;
  assignedMarketer: string;
}

interface Client {
  id: string;
  companyName: string;
}

interface IP {
  id: string;
  name: string;
}

interface Assessment {
  id: string;
  consultantId: string;
  consultantName: string;
  clientId: string;
  clientName: string;
  assessmentType: string;
  interviewTime: string;
  attendees: string[];
  status: string;
  createdBy: string;
  clientFeedback?: string;
  intervieweeFeedback?: string;
}

const Assessments = () => {
  const { user, isTeamLead } = useAuth();
  const [consultantFilter, setConsultantFilter] = useState('');
  const [employerFilter, setEmployerFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [pocFilter, setPocFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<'my' | 'team'>('my');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const savedAssessments = localStorage.getItem('assessments');
    return savedAssessments ? JSON.parse(savedAssessments) : [];
  });
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });
  const [ips, setIPs] = useState<IP[]>(() => {
    const savedIPs = localStorage.getItem('implementationPartners');
    return savedIPs ? JSON.parse(savedIPs) : [];
  });
  const [formData, setFormData] = useState({
    consultantId: '',
    clientId: '',
    assessmentType: 'Interview',
    interviewTime: '',
    attendees: ''
  });

  // Save assessments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('assessments', JSON.stringify(assessments));
  }, [assessments]);

  // Load data from localStorage
  useEffect(() => {
    const storedConsultants = JSON.parse(localStorage.getItem('consultants') || '[]');
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');

    // Filter consultants based on user role and active status
    const filteredConsultants = storedConsultants.filter((consultant: Consultant) => {
      if (consultant.status !== 'active') return false;
      if (isTeamLead) {
        // Team leads can see all consultants
        return true;
      } else {
        // Regular marketers can only see their assigned consultants
        return consultant.assignedMarketer === user?.id;
      }
    });

    setConsultants(filteredConsultants);
    setClients(storedClients);
  }, [isTeamLead, user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedConsultant = consultants.find(c => c.id === formData.consultantId);
    const selectedClient = clients.find(c => c.id === formData.clientId);

    const newAssessment: Assessment = {
      id: Date.now().toString(),
      consultantId: formData.consultantId,
      consultantName: selectedConsultant?.name || '',
      clientId: formData.clientId,
      clientName: selectedClient?.companyName || '',
      assessmentType: formData.assessmentType,
      interviewTime: formData.interviewTime,
      attendees: formData.attendees.split(',').map(email => email.trim()),
      status: 'scheduled',
      createdBy: user?.id || '',
      clientFeedback: '',
      intervieweeFeedback: ''
    };

    // Save to localStorage
    const updatedAssessments = [...assessments, newAssessment];
    localStorage.setItem('assessments', JSON.stringify(updatedAssessments));
    setAssessments(updatedAssessments);

    // Reset form and close modal
    setFormData({
      consultantId: '',
      clientId: '',
      assessmentType: 'Interview',
      interviewTime: '',
      attendees: ''
    });
    setShowAddModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-blue-400';
      case 'cleared':
        return 'text-green-400';
      case 'rescheduled':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Assessments</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">Assessments</span>
            <span className="text-gray-500">→</span>
            <span className="text-xs text-gray-400">List</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center gap-2"
          >
            Add New
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          value={consultantFilter}
          onChange={(e) => setConsultantFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Consultant</option>
        </select>
        <select
          value={employerFilter}
          onChange={(e) => setEmployerFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Employer</option>
        </select>
        <select
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Vendor</option>
        </select>
        <select
          value={pocFilter}
          onChange={(e) => setPocFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">POC</option>
        </select>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.companyName}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="cleared">Cleared</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
            placeholder="Start"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
            placeholder="End"
          />
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Consultant</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Slot</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Attendees</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client Feedback</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Interviewee Feedback</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-700/20">
                  <td className="px-3 py-2">
                    <span className="text-xs text-blue-400 hover:underline cursor-pointer">
                      {assessment.consultantName}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{assessment.interviewTime}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{assessment.assessmentType}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs ${getStatusColor(assessment.status)}`}>
                      {assessment.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{assessment.attendees.join(', ')}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{assessment.clientName}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{assessment.clientFeedback || '-'}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{assessment.intervieweeFeedback || '-'}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10" title="Join Meeting">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
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
          <span>{assessments.length} of {assessments.length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded hover:bg-gray-700">←</button>
          <span>{assessments.length > 0 ? 1 : 0}</span>
          <span>/</span>
          <span>{Math.ceil(assessments.length / 10)}</span>
          <button className="px-2 py-1 rounded hover:bg-gray-700">→</button>
        </div>
      </div>

      {/* Add Assessment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule New Assessment"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Consultant <span className="text-red-500">*</span>
              </label>
              <select
                name="consultantId"
                value={formData.consultantId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Select consultant...</option>
                {consultants.map((consultant) => (
                  <option key={consultant.id} value={consultant.id}>
                    {consultant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Interview Time Slot <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="interviewTime"
                value={formData.interviewTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Assessment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="assessmentType"
                value={formData.assessmentType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Select type...</option>
                <option value="Interview">Interview</option>
                <option value="Screening">Screening</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Select client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Attendees <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="attendees"
                value={formData.attendees}
                onChange={handleInputChange}
                placeholder="Enter attendee emails (comma separated)"
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
              Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assessments; 
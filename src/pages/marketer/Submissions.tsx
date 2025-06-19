import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Pencil, Play, Download, X, Upload, FileText, Calendar } from 'lucide-react';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

interface Consultant {
  id: string;
  name: string;
  phone: string;
  status: string;
  assignedMarketer: string;
}

interface Submission {
  id: string;
  consultantName: string;
  marketingProfile: string;
  vendor: string;
  client: string;
  implementationPartner: string;
  type: string;
  source: string;
  jobTitle: string;
  jobLocation: string;
  submissionDate: string;
  jobDescription: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
  resumeFileName?: string;
  jdFileName?: string;
}

interface Profile {
  id: string;
  fullName: string;
  technologies: string[];
  workAuth: string;
  dob: string;
  isActive: boolean;
  marketingEmail: string;
  emailPassword: string;
  adHoc: boolean;
  resumes: string;
  educations: boolean;
  createdAt: string;
  isTeamProfile: boolean;
}

interface SubmissionFormData {
  consultantName: string;
  marketingProfile: string;
  vendor: string;
  client: string;
  implementationPartner: string;
  type: string;
  source: string;
  jobTitle: string;
  jobLocation: string;
  submissionDate: string;
  jobDescription: string;
  attachmentResume?: File;
  jdAttachment?: File;
}

interface Vendor {
  id: string;
  companyName: string;
  email: string;
  type: string;
}

interface Client {
  id: string;
  companyName: string;
  email: string;
}

interface IP {
  id: string;
  companyName: string;
  email: string;
  type: string;
}

const Submissions = () => {
  const { user, isTeamLead } = useAuth();
  const [searchName, setSearchName] = useState('');
  const [employerFilter, setEmployerFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<'my' | 'team'>('my');
  const [showAddModal, setShowAddModal] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [formData, setFormData] = useState<SubmissionFormData>({
    consultantName: '',
    marketingProfile: '',
    vendor: '',
    client: '',
    implementationPartner: '',
    type: '',
    source: '',
    jobTitle: '',
    jobLocation: '',
    submissionDate: new Date().toISOString().split('T')[0],
    jobDescription: ''
  });
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [selectedJD, setSelectedJD] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const savedSubmissions = localStorage.getItem('submissions');
    return savedSubmissions ? JSON.parse(savedSubmissions) : [];
  });
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const savedVendors = localStorage.getItem('vendors');
    return savedVendors ? JSON.parse(savedVendors) : [];
  });
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });
  const [ips, setIPs] = useState<IP[]>(() => {
    const savedIPs = localStorage.getItem('implementationPartners');
    return savedIPs ? JSON.parse(savedIPs) : [];
  });
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ companyName: '', email: '', type: 'vendor' });
  const [newClient, setNewClient] = useState({ companyName: '', email: '' });
  const [newIP, setNewIP] = useState({ companyName: '', email: '', type: 'ip' });

  // Load consultants from localStorage
  useEffect(() => {
    const storedConsultants = JSON.parse(localStorage.getItem('consultants') || '[]');
    
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
  }, [isTeamLead, user?.id]);

  // Load marketing profiles from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('marketingProfiles');
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles);
      setProfiles(parsedProfiles);
    }
  }, []);

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('implementationPartners', JSON.stringify(ips));
  }, [ips]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'jd') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'resume') {
        setSelectedResume(e.target.files[0]);
      } else {
        setSelectedJD(e.target.files[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSubmission: Submission = {
      id: Date.now().toString(),
      consultantName: formData.consultantName,
      marketingProfile: formData.marketingProfile,
      vendor: formData.vendor,
      client: formData.client,
      implementationPartner: formData.implementationPartner,
      type: formData.type,
      source: formData.source,
      jobTitle: formData.jobTitle,
      jobLocation: formData.jobLocation,
      submissionDate: formData.submissionDate,
      jobDescription: formData.jobDescription,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      resumeFileName: selectedResume?.name,
      jdFileName: selectedJD?.name
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setShowAddModal(false);
    setFormData({
      consultantName: '',
      marketingProfile: '',
      vendor: '',
      client: '',
      implementationPartner: '',
      type: '',
      source: '',
      jobTitle: '',
      jobLocation: '',
      submissionDate: new Date().toISOString().split('T')[0],
      jobDescription: ''
    });
    setSelectedResume(null);
    setSelectedJD(null);
  };

  const handleDownload = () => {
    // Implement download logic
    console.log('Downloading submissions');
  };

  const handleAddSubmission = (data: SubmissionFormData) => {
    // Implement add submission logic
    console.log('Adding submission:', data);
    setShowAddModal(false);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor: Vendor = {
      id: Date.now().toString(),
      ...newVendor
    };
    setVendors(prev => [...prev, vendor]);
    setShowVendorModal(false);
    setNewVendor({ companyName: '', email: '', type: 'vendor' });
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      id: Date.now().toString(),
      ...newClient
    };
    setClients(prev => [...prev, client]);
    setShowClientModal(false);
    setNewClient({ companyName: '', email: '' });
  };

  const handleAddIP = (e: React.FormEvent) => {
    e.preventDefault();
    const ip: IP = {
      id: Date.now().toString(),
      ...newIP
    };
    setIPs(prev => [...prev, ip]);
    setShowIPModal(false);
    setNewIP({ companyName: '', email: '', type: 'ip' });
  };

  return (
    <div className="space-y-3">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Submissions</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">Submissions</span>
            <span className="text-gray-500">→</span>
            <span className="text-xs text-gray-400">List</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-white"
            title="Download Submissions"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Client</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300"
        >
          <option value="">Status</option>
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
        <div className="flex gap-2">
          <button 
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center gap-1.5"
            onClick={() => console.log('Applying filters')}
          >
            Apply
            <Search className="w-3 h-3" />
          </button>
          <button 
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            Add New
          </button>
        </div>
      </div>

      {/* Submissions Type Toggle */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveFilter('my')}
          className={`px-3 py-1.5 text-xs ${
            activeFilter === 'my'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          My Submissions
        </button>
        <button
          onClick={() => setActiveFilter('team')}
          className={`px-3 py-1.5 text-xs ${
            activeFilter === 'team'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Team's Submissions
        </button>
      </div>

      {/* Submissions Table */}
      <div className="bg-gray-800/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Consultant</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Client</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Vendor</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">IP</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Location</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Position</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-700/20">
                  <td className="px-3 py-2">
                    <span className="text-xs text-blue-400 hover:underline cursor-pointer">
                      {submission.consultantName}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs ${
                      submission.status === 'Accepted' ? 'text-green-400' :
                      submission.status === 'Rejected' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{submission.client}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{submission.vendor}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{submission.implementationPartner}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{new Date(submission.submissionDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{submission.jobLocation}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{submission.jobTitle}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30">
                        Int
                      </button>
                      <button className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
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

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg px-4 py-2">
          <span>{submissions.length} of {submissions.length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded hover:bg-gray-700">←</button>
          <span>{submissions.length > 0 ? 1 : 0}</span>
          <span>/</span>
          <span>{Math.ceil(submissions.length / 10)}</span>
          <button className="px-2 py-1 rounded hover:bg-gray-700">→</button>
        </div>
      </div>

      {/* Add Submission Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Make New Submission"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Consultants <span className="text-red-500">*</span>
              </label>
              <select
                name="consultantName"
                value={formData.consultantName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Select consultant...</option>
                {consultants.map((consultant) => (
                  <option key={consultant.id} value={consultant.name}>
                    {consultant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Marketing Profile <span className="text-red-500">*</span>
              </label>
              <select
                name="marketingProfile"
                value={formData.marketingProfile}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Select profile...</option>
                {profiles.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.fullName} - {profile.marketingEmail}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                >
                  <option value="">Search by complete email...</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.companyName} - {vendor.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowVendorModal(true)}
                  className="p-1.5 text-green-400 hover:text-green-300 border border-green-400 rounded-lg hover:bg-green-400/10"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-400 mb-1">Client</label>
              <div className="flex gap-2">
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                >
                  <option value="">Search by complete email...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.companyName} - {client.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowClientModal(true)}
                  className="p-1.5 text-green-400 hover:text-green-300 border border-green-400 rounded-lg hover:bg-green-400/10"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-400 mb-1">Implementation Partner</label>
              <div className="flex gap-2">
                <select
                  name="implementationPartner"
                  value={formData.implementationPartner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
                >
                  <option value="">Search by complete email...</option>
                  {ips.map(ip => (
                    <option key={ip.id} value={ip.id}>
                      {ip.companyName} - {ip.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowIPModal(true)}
                  className="p-1.5 text-green-400 hover:text-green-300 border border-green-400 rounded-lg hover:bg-green-400/10"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Select type...</option>
                <option value="fulltime">Full Time</option>
                <option value="contract">Contract</option>
                <option value="contract_to_hire">Contract to Hire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Source <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Job Location <span className="text-red-500">*</span>
              </label>
              <select
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              >
                <option value="">Please select</option>
                <option value="remote">Remote/Work From Home</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Submission date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Resume Attachment</label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  Upload Resume
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'resume')}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
                <span className="text-xs text-gray-400">
                  {selectedResume ? selectedResume.name : 'No file selected'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">JD Attachment</label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  Upload JD
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'jd')}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
                <span className="text-xs text-gray-400">
                  {selectedJD ? selectedJD.name : 'No file selected'}
                </span>
              </div>
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
              Create Submission
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        title="Add New Vendor"
      >
        <form onSubmit={handleAddVendor}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newVendor.companyName}
                onChange={(e) => setNewVendor({ ...newVendor, companyName: e.target.value })}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowVendorModal(false)}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
            >
              Add Vendor
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Client Modal */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title="Add New Client"
      >
        <form onSubmit={handleAddClient}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newClient.companyName}
                onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowClientModal(false)}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
            >
              Add Client
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Implementation Partner Modal */}
      <Modal
        isOpen={showIPModal}
        onClose={() => setShowIPModal(false)}
        title="Add New Implementation Partner"
      >
        <form onSubmit={handleAddIP}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newIP.companyName}
                onChange={(e) => setNewIP({ ...newIP, companyName: e.target.value })}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={newIP.email}
                onChange={(e) => setNewIP({ ...newIP, email: e.target.value })}
                required
                className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowIPModal(false)}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
            >
              Add Implementation Partner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Submissions;
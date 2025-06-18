import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Pencil, Play, Download, X, Upload, FileText } from 'lucide-react';
import Modal from '../../components/Modal';

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

interface ProfileFormData {
  fullName: string;
  technologies: string;
  workAuth: string;
  dob: string;
  marketingEmail: string;
  emailPassword: string;
  resume?: File;
  isActive: boolean;
  adHoc: boolean;
  educations: boolean;
}

const ProfileForm: React.FC<{ 
  onClose: () => void; 
  initialData?: Profile;
  onSubmit: (data: ProfileFormData) => void;
}> = ({ onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: initialData?.fullName || '',
    technologies: initialData?.technologies.join(', ') || '',
    workAuth: initialData?.workAuth || 'GC',
    dob: initialData?.dob || '',
    marketingEmail: initialData?.marketingEmail || '',
    emailPassword: initialData?.emailPassword || '',
    isActive: initialData?.isActive || false,
    adHoc: initialData?.adHoc || false,
    educations: initialData?.educations || false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Validate required fields
    const { fullName, technologies, workAuth, dob, marketingEmail, emailPassword } = formData;
    const isFormValid = Boolean(
      fullName &&
      technologies &&
      workAuth &&
      dob &&
      marketingEmail &&
      emailPassword
    );
    setIsValid(isFormValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({
        ...formData,
        resume: selectedFile || undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Technologies *</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleInputChange}
            required
            placeholder="Separate with commas"
            className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Work Auth *</label>
          <select
            name="workAuth"
            value={formData.workAuth}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
          >
            <option value="GC">GC</option>
            <option value="USC">USC</option>
            <option value="H1B">H1B</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">DOB *</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Marketing Email *</label>
          <input
            type="email"
            name="marketingEmail"
            value={formData.marketingEmail}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Email Password *</label>
          <input
            type="text"
            name="emailPassword"
            value={formData.emailPassword}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-white"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1">Resume</label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600 cursor-pointer">
              <Upload className="w-3 h-3" />
              Upload Resume
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </label>
            <span className="text-xs text-gray-400">
              {selectedFile ? selectedFile.name : 'No file selected'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
          />
          Is Active
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            name="adHoc"
            checked={formData.adHoc}
            onChange={handleInputChange}
            className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
          />
          Ad-Hoc
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            name="educations"
            checked={formData.educations}
            onChange={handleInputChange}
            className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
          />
          Educations
        </label>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-3 py-1.5 rounded-lg text-xs ${
            isValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-600/50 text-white/50 cursor-not-allowed'
          }`}
        >
          Save Profile
        </button>
      </div>
    </form>
  );
};

const Profiles = () => {
  const [searchName, setSearchName] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [workAuthFilter, setWorkAuthFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<'marketing' | 'team'>('marketing');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const savedProfiles = localStorage.getItem('marketingProfiles');
    return savedProfiles ? JSON.parse(savedProfiles) : [];
  });

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('marketingProfiles', JSON.stringify(profiles));
  }, [profiles]);

  const handleEditClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowEditModal(true);
  };

  const handleViewResume = (resumeName: string) => {
    // Implement resume viewing logic
    console.log('Viewing resume:', resumeName);
  };

  const handleDownload = () => {
    // Implement download logic
    console.log('Downloading profiles');
  };

  const handleAddProfile = (formData: ProfileFormData) => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      workAuth: formData.workAuth,
      dob: formData.dob,
      isActive: formData.isActive,
      marketingEmail: formData.marketingEmail,
      emailPassword: formData.emailPassword,
      adHoc: formData.adHoc,
      resumes: formData.resume?.name || '',
      educations: formData.educations,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      isTeamProfile: false
    };

    setProfiles(prev => [newProfile, ...prev]);
    setShowAddModal(false);
  };

  const handleEditProfile = (formData: ProfileFormData) => {
    if (!selectedProfile) return;

    const updatedProfile: Profile = {
      ...selectedProfile,
      fullName: formData.fullName,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      workAuth: formData.workAuth,
      dob: formData.dob,
      isActive: formData.isActive,
      marketingEmail: formData.marketingEmail,
      emailPassword: formData.emailPassword,
      adHoc: formData.adHoc,
      resumes: formData.resume?.name || selectedProfile.resumes,
      educations: formData.educations,
      isTeamProfile: selectedProfile.isTeamProfile
    };

    setProfiles(prev => 
      prev.map(profile => 
        profile.id === selectedProfile.id ? updatedProfile : profile
      )
    );
    setShowEditModal(false);
    setSelectedProfile(null);
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSection = activeFilter === 'team' ? profile.isTeamProfile : !profile.isTeamProfile;
    const matchesSearch = 
      profile.fullName.toLowerCase().includes(searchName.toLowerCase()) &&
      profile.technologies.some(tech => tech.toLowerCase().includes(techFilter.toLowerCase())) &&
      (workAuthFilter ? profile.workAuth === workAuthFilter : true) &&
      profile.marketingEmail.toLowerCase().includes(emailFilter.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header section - same as before */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Marketing Profiles</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">Marketing Profiles</span>
            <span className="text-gray-500">→</span>
            <span className="text-xs text-gray-400">List</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-white"
            title="Download Profiles"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="grid grid-cols-6 gap-3">
        <input
          type="text"
          placeholder="Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Tech filter"
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-400"
        />
        <select
          value={workAuthFilter}
          onChange={(e) => setWorkAuthFilter(e.target.value)}
          className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-400"
        >
          <option value="">Work Auth</option>
          <option value="GC">GC</option>
          <option value="USC">USC</option>
          <option value="H1B">H1B</option>
        </select>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-400"
        >
          <option value="">Location</option>
        </select>
        <input
          type="text"
          placeholder="Email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-400"
        />
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

      {/* Profile Type Toggle */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveFilter('marketing')}
          className={`px-3 py-1.5 text-xs ${
            activeFilter === 'marketing'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Marketing Profiles
        </button>
        <button
          onClick={() => setActiveFilter('team')}
          className={`px-3 py-1.5 text-xs ${
            activeFilter === 'team'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Team Marketing Profiles
        </button>
      </div>

      {/* Profiles Table */}
      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Full Name</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Technologies</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Work Auth</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">DOB</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Is Active</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Marketing Email</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Email Password</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Ad-Hoc</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Resumes</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Educations</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Created At</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-700/20">
                  <td className="px-3 py-2">
                    <span className="text-xs font-medium text-white">{profile.fullName}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {profile.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{profile.workAuth}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{profile.dob}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`w-2 h-2 rounded-full inline-block ${profile.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{profile.marketingEmail}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{profile.emailPassword}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`w-2 h-2 rounded-full inline-block ${profile.adHoc ? 'bg-green-500' : 'bg-red-500'}`} />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleViewResume(profile.resumes)}
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      {profile.resumes}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`w-2 h-2 rounded-full inline-block ${profile.educations ? 'bg-green-500' : 'bg-red-500'}`} />
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-300">{profile.createdAt}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <button
                        onClick={() => handleViewResume(profile.resumes)}
                        className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10"
                        title="View Profile"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEditClick(profile)}
                        className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10"
                        title="Edit Profile"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        className="p-1 text-blue-400 hover:text-blue-300 rounded-md hover:bg-blue-500/10"
                        title="More Actions"
                      >
                        <Play className="w-3 h-3" />
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
          <span>{filteredProfiles.length} of {profiles.filter(p => activeFilter === 'team' ? p.isTeamProfile : !p.isTeamProfile).length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
            disabled={true}
          >
            ←
          </button>
          <span>0 / 0</span>
          <button
            className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
            disabled={true}
          >
            →
          </button>
        </div>
      </div>

      {/* Add Profile Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Marketing Profile"
      >
        <ProfileForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProfile}
        />
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
      >
        <ProfileForm
          onClose={() => setShowEditModal(false)}
          initialData={selectedProfile || undefined}
          onSubmit={handleEditProfile}
        />
      </Modal>
    </div>
  );
};

export default Profiles; 
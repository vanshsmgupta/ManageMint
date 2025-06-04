import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, Plus, Briefcase, Calendar, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

interface Offer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  status: 'active' | 'pending' | 'closed';
  date: string;
  description?: string;
  requirements?: string[];
  startDate?: string;
  endDate?: string;
  rate?: number;
}

interface NewOffer {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  startDate: string;
  rate: string;
}

const Offers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOffer, setNewOffer] = useState<NewOffer>({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    startDate: new Date().toISOString().split('T')[0],
    rate: ''
  });

  // Load offers from localStorage
  const [offers, setOffers] = useState<Offer[]>(() => {
    const savedOffers = localStorage.getItem('marketer_offers');
    return savedOffers ? JSON.parse(savedOffers) : [
      {
        id: '1',
        title: 'Senior React Developer',
        company: 'Tech Corp Inc.',
        location: 'New York, NY',
        salary: '$120k - $150k',
        status: 'active',
        date: '2024-03-15',
      },
      {
        id: '2',
        title: 'Full Stack Engineer',
        company: 'Startup Co.',
        location: 'Remote',
        salary: '$100k - $130k',
        status: 'pending',
        date: '2024-03-14',
      },
      {
        id: '3',
        title: 'DevOps Engineer',
        company: 'Enterprise Solutions',
        location: 'San Francisco, CA',
        salary: '$130k - $160k',
        status: 'closed',
        date: '2024-03-10',
      },
    ];
  });

  // Save offers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('marketer_offers', JSON.stringify(offers));
  }, [offers]);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const offer: Offer = {
        id: Math.random().toString(36).substr(2, 9),
        ...newOffer,
        status: 'active',
        date: new Date().toISOString().split('T')[0],
        requirements: newOffer.requirements.split('\n').filter(req => req.trim()),
        rate: parseFloat(newOffer.rate)
      };

      setOffers(prev => [offer, ...prev]);
      setShowCreateModal(false);
      
      // Store in localStorage for the admin view
      const userOffers = JSON.parse(localStorage.getItem(`offers_${localStorage.getItem('userId')}`) || '[]');
      localStorage.setItem(`offers_${localStorage.getItem('userId')}`, JSON.stringify([...userOffers, offer]));

      setNewOffer({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        requirements: '',
        startDate: new Date().toISOString().split('T')[0],
        rate: ''
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Error creating offer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || offer.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Offers</h1>
          <p className="text-gray-400">Manage and track your job offers</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Offer
        </Button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white rounded-md focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-700/30 rounded-lg gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{offer.title}</h3>
                  <p className="text-gray-400">{offer.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">{offer.location}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">{offer.salary}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  offer.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  offer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-400 hover:bg-gray-700"
                  onClick={() => handleViewDetails(offer)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Offer"
      >
        <form onSubmit={handleCreateOffer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Job Title</label>
            <Input
              type="text"
              required
              value={newOffer.title}
              onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
              placeholder="Enter job title"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Company</label>
            <Input
              type="text"
              required
              value={newOffer.company}
              onChange={(e) => setNewOffer({ ...newOffer, company: e.target.value })}
              placeholder="Enter company name"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
            <Input
              type="text"
              required
              value={newOffer.location}
              onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
              placeholder="Enter job location"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Salary Range</label>
            <Input
              type="text"
              required
              value={newOffer.salary}
              onChange={(e) => setNewOffer({ ...newOffer, salary: e.target.value })}
              placeholder="e.g. $100k - $130k"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Hourly Rate</label>
            <Input
              type="number"
              required
              value={newOffer.rate}
              onChange={(e) => setNewOffer({ ...newOffer, rate: e.target.value })}
              placeholder="Enter hourly rate"
              className="bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Date</label>
            <Input
              type="date"
              required
              value={newOffer.startDate}
              onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
              className="bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Job Description</label>
            <textarea
              required
              value={newOffer.description}
              onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
              placeholder="Enter job description"
              className="w-full px-3 py-2 bg-white text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Requirements (one per line)</label>
            <textarea
              required
              value={newOffer.requirements}
              onChange={(e) => setNewOffer({ ...newOffer, requirements: e.target.value })}
              placeholder="Enter requirements (one per line)"
              className="w-full px-3 py-2 bg-white text-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
              rows={4}
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="border border-gray-600 text-gray-300 hover:bg-gray-700/50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span>Creating...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <span>Create Offer</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Offer Details"
      >
        {selectedOffer && (
          <div className="space-y-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{selectedOffer.title}</h3>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  selectedOffer.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  selectedOffer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {selectedOffer.status.charAt(0).toUpperCase() + selectedOffer.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Company</p>
                  <p className="text-white">{selectedOffer.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{selectedOffer.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Salary Range</p>
                  <p className="text-white">{selectedOffer.salary}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Start Date</p>
                  <p className="text-white">{new Date(selectedOffer.startDate || selectedOffer.date).toLocaleDateString()}</p>
                </div>
                {selectedOffer.rate && (
                  <div>
                    <p className="text-sm text-gray-400">Hourly Rate</p>
                    <p className="text-green-400">{formatCurrency(selectedOffer.rate)}/hr</p>
                  </div>
                )}
              </div>

              {selectedOffer.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-2">Description</h4>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedOffer.description}</p>
                </div>
              )}

              {selectedOffer.requirements && selectedOffer.requirements.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedOffer.requirements.map((req, index) => (
                      <li key={index} className="text-gray-300">{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Offers;
import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Offer {
  id: string;
  title: string;
  company: string;
  status: 'ongoing' | 'pending' | 'completed';
  startDate: string;
  endDate?: string;
  rate: number;
  description: string;
}

const MyOffers = () => {
  const [ongoingOffers, setOngoingOffers] = useState<Offer[]>([]);
  const [pendingOffers, setPendingOffers] = useState<Offer[]>([]);
  const [completedOffers, setCompletedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch offers from the API
  const fetchOffers = async () => {
    try {
      const response = await axios.get('/api/offers');
      const offers = response.data;

      // Sort offers by status
      setOngoingOffers(offers.filter(offer => offer.status === 'ongoing'));
      setPendingOffers(offers.filter(offer => offer.status === 'pending'));
      setCompletedOffers(offers.filter(offer => offer.status === 'completed'));
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleMarkAsDone = async (offerId: string) => {
    try {
      await axios.post(`/api/offers/${offerId}/complete`);
      toast.success('Offer marked as completed');
      fetchOffers(); // Refresh the offers list
    } catch (error) {
      console.error('Error marking offer as done:', error);
      toast.error('Failed to mark offer as completed');
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await axios.post(`/api/offers/${offerId}/accept`);
      toast.success('Offer accepted');
      fetchOffers(); // Refresh the offers list
    } catch (error) {
      console.error('Error accepting offer:', error);
      toast.error('Failed to accept offer');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Offers</h1>
        <p className="text-gray-400">View and manage your offers</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Ongoing Offers</p>
              <p className="text-2xl font-semibold text-white mt-1">{ongoingOffers.length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending Offers</p>
              <p className="text-2xl font-semibold text-white mt-1">{pendingOffers.length}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed Offers</p>
              <p className="text-2xl font-semibold text-white mt-1">{completedOffers.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Offers */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-green-400 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Ongoing Offers
          </h2>
        </div>
        <div className="p-6">
          {ongoingOffers.length > 0 ? (
            <div className="space-y-4">
              {ongoingOffers.map(offer => (
                <div 
                  key={offer.id} 
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg text-white">{offer.title}</h3>
                      <p className="text-gray-400">{offer.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Start Date: {offer.startDate}</p>
                    <p>End Date: {offer.endDate}</p>
                    <p>Rate: ${offer.rate}/hr</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">{offer.description}</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleMarkAsDone(offer.id)}
                      className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No ongoing offers at the moment
            </div>
          )}
        </div>
      </div>

      {/* Pending Offers */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-yellow-400 flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            Pending Offers
          </h2>
        </div>
        <div className="p-6">
          {pendingOffers.length > 0 ? (
            <div className="space-y-4">
              {pendingOffers.map(offer => (
                <div 
                  key={offer.id} 
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg text-white">{offer.title}</h3>
                      <p className="text-gray-400">{offer.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400">
                      Pending
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Start Date: {offer.startDate}</p>
                    <p>Rate: ${offer.rate}/hr</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">{offer.description}</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleAcceptOffer(offer.id)}
                      className="px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg transition-colors"
                    >
                      Accept Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No pending offers at the moment
            </div>
          )}
        </div>
      </div>

      {/* Completed Offers */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-blue-400 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Completed Offers
          </h2>
        </div>
        <div className="p-6">
          {completedOffers.length > 0 ? (
            <div className="space-y-4">
              {completedOffers.map(offer => (
                <div 
                  key={offer.id} 
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg text-white">{offer.title}</h3>
                      <p className="text-gray-400">{offer.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                      Completed
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Start Date: {offer.startDate}</p>
                    <p>End Date: {offer.endDate}</p>
                    <p>Rate: ${offer.rate}/hr</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">{offer.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No completed offers yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOffers; 
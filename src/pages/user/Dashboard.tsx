import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';

interface OfferData {
  id: string;
  consultantName: string;
  client: string;
  vendor: string;
  marketer: string;
  inhouseEngineer: string;
  technology: string;
  startDate: string;
  endDate: string;
  resume: string;
  timesheet: string;
  status: 'ongoing' | 'pending';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchOngoing, setSearchOngoing] = useState('');
  const [searchPending, setSearchPending] = useState('');
  const [offers, setOffers] = useState<OfferData[]>(() => {
    const savedOffers = localStorage.getItem('offers');
    return savedOffers ? JSON.parse(savedOffers) : [];
  });

  const ongoingOffers = offers.filter(offer => offer.status === 'ongoing');
  const pendingOffers = offers.filter(offer => offer.status === 'pending');

  const TableHeader = () => (
    <div className="grid grid-cols-10 gap-6 py-4 px-6 bg-gray-800/50 border-b border-gray-700 text-sm font-semibold text-gray-300">
      <div className="col-span-1 whitespace-nowrap">CONSULTANT NAME</div>
      <div className="col-span-1 whitespace-nowrap">CLIENT</div>
      <div className="col-span-1 whitespace-nowrap">VENDOR</div>
      <div className="col-span-1 whitespace-nowrap">MARKETER</div>
      <div className="col-span-1 whitespace-nowrap">INHOUSE ENGINEER</div>
      <div className="col-span-1 whitespace-nowrap">TECHNOLOGY</div>
      <div className="col-span-1 whitespace-nowrap">START DATE</div>
      <div className="col-span-1 whitespace-nowrap">END DATE</div>
      <div className="col-span-1 whitespace-nowrap">RESUME</div>
      <div className="col-span-1 whitespace-nowrap">TIME SHEET</div>
    </div>
  );

  const TableRow = ({ data }: { data: OfferData }) => (
    <div className="grid grid-cols-10 gap-6 py-4 px-6 border-b border-gray-700 text-sm text-gray-300 hover:bg-gray-700/30 transition-colors duration-150">
      <div className="col-span-1 truncate font-medium">{data.consultantName}</div>
      <div className="col-span-1 truncate">{data.client}</div>
      <div className="col-span-1 truncate">{data.vendor}</div>
      <div className="col-span-1 truncate">{data.marketer}</div>
      <div className="col-span-1 truncate">{data.inhouseEngineer}</div>
      <div className="col-span-1 truncate">
        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
          {data.technology}
        </span>
      </div>
      <div className="col-span-1 truncate">{data.startDate}</div>
      <div className="col-span-1 truncate">{data.endDate}</div>
      <div className="col-span-1">
        <button className="px-3 py-1 text-purple-400 hover:bg-purple-600/20 rounded-md transition-colors duration-150 font-medium">
          {data.resume}
        </button>
      </div>
      <div className="col-span-1">
        <button 
          onClick={() => navigate('/timesheet')}
          className="px-3 py-1 text-purple-400 hover:bg-purple-600/20 rounded-md transition-colors duration-150 font-medium"
        >
          {data.timesheet}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Dashboard</h1>
        <p className="text-gray-400">View your ongoing and pending offers</p>
      </div>

      {/* Ongoing Offers Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg mb-8 overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-400 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Ongoing offers
          </h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchOngoing}
              onChange={(e) => setSearchOngoing(e.target.value)}
              className="pl-10 pr-4 py-2 w-72 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <TableHeader />
            {ongoingOffers
              .filter(offer => 
                offer.consultantName.toLowerCase().includes(searchOngoing.toLowerCase()) ||
                offer.client.toLowerCase().includes(searchOngoing.toLowerCase()) ||
                offer.technology.toLowerCase().includes(searchOngoing.toLowerCase())
              )
              .map((offer, index) => (
                <TableRow key={offer.id} data={offer} />
              ))}
          </div>
        </div>
      </div>

      {/* Joining Pending Offers Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-yellow-400 flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            Joining Pending offers
          </h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchPending}
              onChange={(e) => setSearchPending(e.target.value)}
              className="pl-10 pr-4 py-2 w-72 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <TableHeader />
            {pendingOffers
              .filter(offer => 
                offer.consultantName.toLowerCase().includes(searchPending.toLowerCase()) ||
                offer.client.toLowerCase().includes(searchPending.toLowerCase()) ||
                offer.technology.toLowerCase().includes(searchPending.toLowerCase())
              )
              .map((offer, index) => (
                <TableRow key={offer.id} data={offer} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
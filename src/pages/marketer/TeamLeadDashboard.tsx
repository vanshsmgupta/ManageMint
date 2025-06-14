import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, ChartBar, Calendar } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: 'active' | 'inactive';
  clients: number;
  submissions: number;
  lastActivity: string;
}

interface TeamMetrics {
  totalSubmissions: number;
  activeClients: number;
  teamMembers: number;
  conversionRate: number;
}

const TeamLeadDashboard: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [metrics, setMetrics] = useState<TeamMetrics>({
    totalSubmissions: 0,
    activeClients: 0,
    teamMembers: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Load team members from localStorage or API
    const loadTeamMembers = () => {
      const savedMarketers = localStorage.getItem('marketers');
      if (savedMarketers) {
        const allMarketers = JSON.parse(savedMarketers);
        const teamMembersList = allMarketers.filter((m: any) => !m.isTeamLead);
        setTeamMembers(teamMembersList);
        
        // Calculate metrics
        setMetrics({
          totalSubmissions: teamMembersList.reduce((acc: number, curr: TeamMember) => acc + curr.submissions, 0),
          activeClients: teamMembersList.reduce((acc: number, curr: TeamMember) => acc + curr.clients, 0),
          teamMembers: teamMembersList.length,
          conversionRate: calculateConversionRate(teamMembersList)
        });
      }
    };

    loadTeamMembers();
  }, []);

  const calculateConversionRate = (members: TeamMember[]) => {
    const totalSubmissions = members.reduce((acc, curr) => acc + curr.submissions, 0);
    const totalClients = members.reduce((acc, curr) => acc + curr.clients, 0);
    return totalSubmissions > 0 ? (totalClients / totalSubmissions) * 100 : 0;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Dashboard</h1>
        <p className="text-gray-400">Manage and monitor your team's performance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Submissions</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.totalSubmissions}</h3>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Clients</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.activeClients}</h3>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Team Members</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.teamMembers}</h3>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.conversionRate.toFixed(1)}%</h3>
            </div>
            <ChartBar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Clients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`https://i.pravatar.cc/40?u=${member.id}`}
                        alt={member.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="font-medium text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-sm text-purple-400 bg-purple-500/20 rounded-full">
                      {member.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.clients}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.submissions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboard; 
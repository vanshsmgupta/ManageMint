import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, ChartBar, Calendar } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  projects: number;
  tasks: number;
  lastActivity: string;
  performance: number;
}

interface TeamMetrics {
  totalProjects: number;
  completedTasks: number;
  teamMembers: number;
  averagePerformance: number;
}

const TeamLeadDashboard: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [metrics, setMetrics] = useState<TeamMetrics>({
    totalProjects: 0,
    completedTasks: 0,
    teamMembers: 0,
    averagePerformance: 0
  });

  useEffect(() => {
    // Load team members from localStorage or API
    const loadTeamMembers = () => {
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        const allUsers = JSON.parse(savedUsers);
        const teamMembersList = allUsers.filter((u: any) => !u.isTeamLead && u.role === 'user');
        setTeamMembers(teamMembersList);
        
        // Calculate metrics
        setMetrics({
          totalProjects: teamMembersList.reduce((acc: number, curr: TeamMember) => acc + curr.projects, 0),
          completedTasks: teamMembersList.reduce((acc: number, curr: TeamMember) => acc + curr.tasks, 0),
          teamMembers: teamMembersList.length,
          averagePerformance: calculateAveragePerformance(teamMembersList)
        });
      }
    };

    loadTeamMembers();
  }, []);

  const calculateAveragePerformance = (members: TeamMember[]) => {
    if (members.length === 0) return 0;
    const totalPerformance = members.reduce((acc, curr) => acc + curr.performance, 0);
    return totalPerformance / members.length;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Engineering Team Dashboard</h1>
        <p className="text-gray-400">Manage and monitor your team's performance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Projects</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.totalProjects}</h3>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Tasks</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.completedTasks}</h3>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Team Members</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.teamMembers}</h3>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Performance</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metrics.averagePerformance.toFixed(1)}%</h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Performance</th>
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.projects}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.tasks}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 rounded-full h-2" 
                          style={{ width: `${member.performance}%` }}
                        />
                      </div>
                      <span className="text-gray-300">{member.performance}%</span>
                    </div>
                  </td>
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
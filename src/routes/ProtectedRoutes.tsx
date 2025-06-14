import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin Components
import AdminDashboard from '../pages/admin/Dashboard';
import Marketers from '../pages/admin/Marketers';
import Engineers from '../pages/admin/Engineers';

// Marketer Components
import MarketerDashboard from '../pages/marketer/Dashboard';
import TeamLeadDashboard from '../pages/marketer/TeamLeadDashboard';
import Profiles from '../pages/marketer/Profiles';
import Submissions from '../pages/marketer/Submissions';
import Assessments from '../pages/marketer/Assessments';
import Offers from '../pages/marketer/Offers';

// Engineer Components
import EngineerDashboard from '../pages/engineer/Dashboard';
import EngineerTeamLeadDashboard from '../pages/engineer/TeamLeadDashboard';
import Projects from '../pages/engineer/Projects';
import Tasks from '../pages/engineer/Tasks';

const ProtectedRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin Routes
  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/marketers" element={<Marketers />} />
        <Route path="/engineers" element={<Engineers />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

  // Marketer Team Lead Routes
  if (user.role === 'team_lead' && user.isTeamLead) {
    return (
      <Routes>
        <Route path="/dashboard" element={<TeamLeadDashboard />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

  // Regular Marketer Routes
  if (user.role === 'marketer') {
    return (
      <Routes>
        <Route path="/dashboard" element={<MarketerDashboard />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

  // Engineer Team Lead Routes
  if (user.role === 'engineer' && user.isTeamLead) {
    return (
      <Routes>
        <Route path="/dashboard" element={<EngineerTeamLeadDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

  // Regular Engineer Routes
  if (user.role === 'engineer') {
    return (
      <Routes>
        <Route path="/dashboard" element={<EngineerDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

  // Fallback route
  return <Navigate to="/login" />;
};

export default ProtectedRoutes; 
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MarketerProtectedRouteProps {
  children: React.ReactNode;
}

const MarketerProtectedRoute: React.FC<MarketerProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'marketer' && user?.role !== 'admin')) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default MarketerProtectedRoute; 
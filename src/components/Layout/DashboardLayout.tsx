import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Bell,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Users, label: 'Marketers', path: '/marketers' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  const userNavItems = [
    { icon: Users, label: 'Dashboard', path: '/dashboard' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  const marketerNavItems = [
    { icon: Users, label: 'Dashboard', path: '/dashboard' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  const navItems = user?.role === 'admin' 
    ? adminNavItems 
    : user?.role === 'marketer' 
    ? marketerNavItems 
    : userNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">
                    {user?.firstName?.[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-3 w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                      window.location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout; 
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  UserPlus, 
  FileText, 
  Send, 
  CheckSquare, 
  DollarSign, 
  Building, 
  Shield, 
  Briefcase, 
  List,
  LogOut,
  Menu,
  X,
  User,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

interface NavSection {
  type: 'section';
  title: string;
  items: NavItem[];
}

type NavLink = NavItem | NavSection;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const isPathActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const marketerLinks: NavLink[] = [
    { path: '/marketer/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/marketer/profile', icon: <User size={18} />, label: 'Profile' },
    { path: '/marketer/calendar', icon: <CalendarIcon size={18} />, label: 'Calendar' },
    { path: '/marketer/standup', icon: <Users size={18} />, label: 'Standup' },
    { path: '/marketer/consultants', icon: <UserPlus size={18} />, label: 'Consultants' },
    { path: '/marketer/profiles', icon: <FileText size={18} />, label: 'Profiles' },
    { path: '/marketer/submissions', icon: <Send size={18} />, label: 'Submissions' },
    { path: '/marketer/assessments', icon: <CheckSquare size={18} />, label: 'Assessments' },
    { path: '/marketer/offers', icon: <DollarSign size={18} />, label: 'Offers' },
    { path: '/marketer/marketers', icon: <Users size={18} />, label: 'Marketers' },
    { 
      type: 'section',
      title: 'Contacts',
      items: [
        { path: '/marketer/vendors', icon: <Building size={18} />, label: 'Vendors' },
        { path: '/marketer/pocs', icon: <Users size={18} />, label: 'POCs' },
        { path: '/marketer/ip', icon: <Shield size={18} />, label: 'IP' },
        { path: '/marketer/clients', icon: <Briefcase size={18} />, label: 'Clients' },
        { path: '/marketer/all', icon: <List size={18} />, label: 'All' }
      ]
    }
  ];

  const links = marketerLinks;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">HDI</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white lg:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-4">
            {links.map((link, index) => {
              if ('type' in link && link.type === 'section') {
                return (
                  <div key={index} className="space-y-2">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                      {link.title}
                    </h2>
                    <div className="space-y-1">
                      {link.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          onClick={handleLinkClick}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            isPathActive(item.path)
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    isPathActive(link.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
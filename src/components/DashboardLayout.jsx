import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { signOut } from '../utils/auth';
import { useCurrentUser } from '../hooks/useAuth';

const DashboardLayout = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user data
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/signin');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Classes', path: '/classes' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'fixed inset-0 z-50' : 'hidden lg:flex lg:flex-col lg:w-64'} bg-gray-900`}>
      {mobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Sahayak</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      )}
      
      {!mobile && (
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Sahayak</h2>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (mobile) setSidebarOpen(false);
              navigate(item.path);
            }}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActivePath(item.path)
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <div className="ml-3">
            {userLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-600 rounded w-24"></div>
              </div>
            ) : currentUser ? (
              <>
                <p className="text-sm font-medium text-white">
                  {currentUser.first_name} {currentUser.last_name}
                </p>
                <p className="text-xs text-gray-400">{currentUser.email}</p>
                {currentUser.school_name && (
                  <p className="text-xs text-gray-500">{currentUser.school_name}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-white">Teacher</p>
                <p className="text-xs text-gray-400">Loading...</p>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {sidebarOpen && <Sidebar mobile />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

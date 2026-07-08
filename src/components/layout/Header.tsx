import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import ThemeToggle from '../ThemeToggle';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { level, experience, nextLevelXp, progress } = useGame();
  const { reminders } = useData();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  
  // Count pending reminders
  const pendingReminders = reminders.filter(
    reminder => !reminder.completed && new Date(reminder.datetime) > new Date()
  ).length;
  
  // Close dropdowns when clicking outside
  const profileRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="z-10 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="md:hidden mr-4 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center">
            <span className="font-bold text-xl text-primary-700">GrowthQuest</span>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Level info */}
            <div className="hidden md:flex items-center">
              <div className="mr-3">
                <p className="text-xs text-gray-500">Level {level}</p>
                <p className="text-xs text-gray-400">{experience}/{nextLevelXp} XP</p>
              </div>
              
              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
                
              </div>
            </div>
            <ThemeToggle />

            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {pendingReminders > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {pendingReminders}
                  </span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {reminders.filter(r => !r.completed).length > 0 ? (
                      reminders
                        .filter(r => !r.completed)
                        .slice(0, 5)
                        .map(reminder => (
                          <div 
                            key={reminder.id}
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <p className="text-sm font-medium">{reminder.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(reminder.datetime).toLocaleString()}
                            </p>
                          </div>
                        ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No pending notifications
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link 
                      to="/reminders"
                      className="text-xs text-primary-600 hover:text-primary-800"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View all reminders
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  <User size={16} />
                </div>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
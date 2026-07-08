import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  StickyNote, 
  Target, 
  BookOpen, 
  Bell, 
  Award,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const { user } = useAuth();
  const { level, experience, nextLevelXp, progress } = useGame();
  
  if (!user) return null;
  
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/todos', icon: <CheckSquare size={20} />, label: 'To-Do Lists' },
    { path: '/notes', icon: <StickyNote size={20} />, label: 'Notes' },
    { path: '/goals', icon: <Target size={20} />, label: 'Goals' },
    { path: '/journals', icon: <BookOpen size={20} />, label: 'Journals' },
    { path: '/reminders', icon: <Bell size={20} />, label: 'Reminders' },
  ];
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
        <div className="flex items-center">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Award size={24} className="text-primary-600 mr-2" />
          </motion.div>
          <span className="font-bold text-xl text-primary-700">GrowthQuest</span>
        </div>
        <button 
          onClick={closeSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mr-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="rounded-full" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm">{user.name}</h3>
            <div className="flex items-center">
              <span className="text-xs font-medium text-primary-700 mr-1">Level {level}</span>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                <div 
                  className="h-1.5 bg-primary-600 rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="font-semibold">{experience}</p>
            <p className="text-gray-500">XP</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="font-semibold">{nextLevelXp - experience}</p>
            <p className="text-gray-500">To Level {level + 1}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-primary-700 bg-primary-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="pt-4 mt-4 border-t border-gray-200 px-3">
          <NavLink
            to="/settings"
            onClick={closeSidebar}
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary-700 bg-primary-50 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="mr-3"><Settings size={20} /></span>
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="p-3 bg-primary-50 rounded-lg text-xs text-center">
          <p className="text-primary-700 font-medium mb-1">Daily Tip</p>
          <p className="text-gray-600">Complete tasks to earn XP and unlock achievements!</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
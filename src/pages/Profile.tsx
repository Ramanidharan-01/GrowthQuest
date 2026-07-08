import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Award, 
  Calendar,
  Camera,
  Save,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { level, experience, nextLevelXp, progress, achievements } = useGame();
  
  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  if (!user) return null;
  
  // User joined date
  const joinedDate = user.joined ? new Date(user.joined) : new Date();
  const joinedFormatted = joinedDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const daysActive = Math.floor((new Date().getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate achievement stats
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const achievementPercentage = totalAchievements > 0 
    ? Math.round((unlockedAchievements / totalAchievements) * 100) 
    : 0;
  
  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      await updateProfile({
        name,
        email,
        avatar,
      });
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar || '');
    setIsEditing(false);
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <User className="mr-2 text-primary-600" size={28} />
        My Profile
      </h1>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-3 grid-cols-1"
      >
        {/* Basic info card */}
        <motion.div
          variants={item}
          className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-4xl font-bold mx-auto mb-4 relative">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
              
              {isEditing && (
                <button
                  onClick={() => {/* Image upload functionality would go here */}}
                  className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 rounded-full hover:bg-primary-700 transition-colors"
                  aria-label="Change profile picture"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
            <p className="text-gray-500 mb-4">{user.email}</p>
            
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>Joined {joinedFormatted}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Days active</span>
              <span className="font-medium">{daysActive}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Level and achievements card */}
        <motion.div
          variants={item}
          className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Award size={18} className="mr-2 text-accent-500" />
              Level & Achievements
            </h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-2xl font-bold text-primary-600">Level {level}</span>
                  <span className="text-sm text-gray-500 ml-2">{experience}/{nextLevelXp} XP</span>
                </div>
                <span className="text-sm font-medium text-primary-600">{progress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-accent-600">{unlockedAchievements}</p>
                <p className="text-sm text-gray-500">Achievements Unlocked</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-accent-600">{achievementPercentage}%</p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </div>
            
            <h3 className="text-md font-medium mb-3">Recent Achievements</h3>
            
            <div className="space-y-3">
              {achievements.filter(a => a.unlocked).length > 0 ? (
                achievements
                  .filter(a => a.unlocked)
                  .slice(0, 3)
                  .map(achievement => (
                    <div 
                      key={achievement.id}
                      className="flex items-center p-3 bg-accent-50 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mr-3">
                        <Award size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-accent-800">{achievement.title}</h4>
                        <p className="text-xs text-accent-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-3">
                  No achievements unlocked yet. Keep going!
                </p>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Profile edit form */}
        <motion.div
          variants={item}
          className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <User size={18} className="mr-2 text-gray-700" />
                Profile Information
              </h2>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary text-sm py-1.5"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('Error') 
                  ? 'bg-error-100 text-error-800' 
                  : 'bg-success-100 text-success-800'
              }`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL (optional)
                  </label>
                  <input
                    type="text"
                    value={avatar || ''}
                    onChange={(e) => setAvatar(e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://example.com/your-avatar.jpg"
                    className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a URL to an image for your profile picture
                  </p>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
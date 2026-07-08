import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SettingsIcon,
  Bell,
  Moon,
  Sun,
  LogOut,
  Shield,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showXP, setShowXP] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  if (!user) return null;

  // Save settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setMessage('Settings saved successfully!');
      setIsSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }, 1000);
  };

  // Change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    setPasswordMessage('');

    // Simulate API call
    setTimeout(() => {
      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordMessage('');
      }, 3000);
    }, 1000);
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
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <SettingsIcon className="mr-2 text-gray-700 dark:text-gray-300" size={28} />
        Settings
      </h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* App Settings */}
        <motion.div
          variants={item}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
              Application Settings
            </h2>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-100 text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Bell size={20} className="dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-gray-200">Push Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications for reminders and updates
                      </p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                      className="sr-only peer"
                    />
                    <div className="toggle-switch"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Mail size={20} className="dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-gray-200">Email Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive email updates and reminders
                      </p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      className="sr-only peer"
                    />
                    <div className="toggle-switch"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Award size={20} className="dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-gray-200">Show XP Progress</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Display experience points and level in the header
                      </p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={showXP}
                      onChange={() => setShowXP(!showXP)}
                      className="sr-only peer"
                    />
                    <div className="toggle-switch"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Shield size={20} className="dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-gray-200">Privacy Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hide sensitive information from dashboard
                      </p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={privacyMode}
                      onChange={() => setPrivacyMode(!privacyMode)}
                      className="sr-only peer"
                    />
                    <div className="toggle-switch"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Password Change */}
        <motion.div
          variants={item}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
              Change Password
            </h2>

            {passwordMessage && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  passwordMessage.includes('successfully')
                    ? 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-100'
                    : 'bg-error-100 dark:bg-error-900 text-error-800 dark:text-error-100'
                }`}
              >
                {passwordMessage}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          variants={item}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
              Account
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-error-100 dark:bg-error-900 rounded-lg text-error-600 dark:text-error-400">
                    <LogOut size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-gray-200">Log Out</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sign out of your account
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="btn-ghost text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-800 px-4 py-2 rounded-lg"
                >
                  Log Out
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-error-100 dark:bg-error-900 rounded-lg text-error-600 dark:text-error-400">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-gray-200">Delete Account</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permanently delete your account and all data
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    window.confirm(
                      'Are you sure you want to delete your account? This action cannot be undone.'
                    )
                  }
                  className="btn-ghost text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-800 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Mail icon component
const Mail = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// Award icon component
const Award = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export default Settings;
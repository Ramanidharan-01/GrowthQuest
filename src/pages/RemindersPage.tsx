import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  Filter, 
  X,
  CheckCircle,
  Circle,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useData, Reminder } from '../contexts/DataContext';
import { useGame, XP_ACTIONS } from '../contexts/GameContext';

const REPEAT_OPTIONS = [
  { value: 'none', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const RemindersPage: React.FC = () => {
  const { reminders, addReminder, updateReminder, deleteReminder, toggleReminderCompleted } = useData();
  const { addExperience } = useGame();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState('');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterRepeat, setFilterRepeat] = useState<string>('');
  
  // Initialize datetime input with current date and time
  useEffect(() => {
    if (!showForm) return;
    
    if (!datetime && !editingReminder) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // Set default time to 30 minutes from now
      setDatetime(now.toISOString().slice(0, 16)); // Format as YYYY-MM-DDTHH:MM
    }
  }, [showForm]);
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDatetime('');
    setRepeat('none');
    setEditingReminder(null);
    setShowForm(false);
  };
  
  // Load reminder for editing
  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setTitle(reminder.title);
    setDescription(reminder.description || '');
    setDatetime(new Date(reminder.datetime).toISOString().slice(0, 16));
    setRepeat(reminder.repeat);
    setShowForm(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reminderData = {
      title,
      description: description.trim() !== '' ? description : undefined,
      datetime,
      repeat,
    };
    
    if (editingReminder) {
      updateReminder(editingReminder.id, reminderData);
    } else {
      addReminder(reminderData);
      // Add experience for setting a reminder
      addExperience(XP_ACTIONS.SET_REMINDER, 'SET_REMINDER');
    }
    
    resetForm();
  };
  
  // Check if a reminder is overdue
  const isOverdue = (reminder: Reminder) => {
    if (reminder.completed) return false;
    return new Date(reminder.datetime) < new Date();
  };
  
  // Filter reminders
  const filteredReminders = reminders.filter(reminder => {
    // Filter by status
    if (filterStatus === 'completed' && !reminder.completed) return false;
    if (filterStatus === 'pending' && reminder.completed) return false;
    
    // Filter by repeat
    if (filterRepeat && reminder.repeat !== filterRepeat) return false;
    
    return true;
  });
  
  // Sort reminders by date (upcoming first, then overdue, then completed)
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    // Completed reminders go last
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // If both are completed or both are not completed, sort by date
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Bell className="mr-2 text-secondary-600" size={28} />
            Reminders
          </h1>
          <p className="text-gray-600">Never forget important tasks and events</p>
        </div>
        
        <div className="flex">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mr-2 p-2 btn-ghost rounded-lg"
            aria-label="Filter reminders"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filter Reminders</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="select"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
              <select
                value={filterRepeat}
                onChange={(e) => setFilterRepeat(e.target.value)}
                className="select"
              >
                <option value="">All</option>
                {REPEAT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {editingReminder ? 'Edit Reminder' : 'New Reminder'}
            </h2>
            <button
              onClick={resetForm}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Reminder title"
                  required
                  className="input"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Reminder description"
                  rows={3}
                  className="input"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  required
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as any)}
                  className="select"
                >
                  {REPEAT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingReminder ? 'Update Reminder' : 'Create Reminder'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Reminders list */}
      {sortedReminders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            <Bell size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No reminders found</h3>
          <p className="text-gray-500 mb-4">
            {reminders.length === 0
              ? "You haven't created any reminders yet."
              : "No reminders match your current filters."}
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            <span>Create a new reminder</span>
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {sortedReminders.map((reminder) => {
            const overdue = isOverdue(reminder);
            
            return (
              <motion.div
                key={reminder.id}
                variants={item}
                className={`p-4 bg-white rounded-lg shadow-sm border ${
                  reminder.completed 
                    ? 'border-gray-200 bg-gray-50' 
                    : overdue
                    ? 'border-error-200 bg-error-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <button
                    onClick={() => toggleReminderCompleted(reminder.id)}
                    className={`flex-shrink-0 mt-1 mr-3 ${
                      reminder.completed 
                        ? 'text-success-500 hover:text-success-600' 
                        : overdue
                        ? 'text-error-500 hover:text-error-600'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                    aria-label={reminder.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {reminder.completed ? (
                      <CheckCircle size={22} />
                    ) : (
                      overdue ? <AlertCircle size={22} /> : <Circle size={22} />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      reminder.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {reminder.title}
                    </h3>
                    
                    {reminder.description && (
                      <p className={`mt-1 text-sm ${
                        reminder.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {reminder.description}
                      </p>
                    )}
                    
                    <div className="mt-2 flex flex-wrap items-center text-xs space-x-3">
                      <span className={`flex items-center ${
                        reminder.completed 
                          ? 'text-gray-400' 
                          : overdue
                          ? 'text-error-600'
                          : 'text-gray-500'
                      }`}>
                        <Clock size={14} className="mr-1" />
                        {new Date(reminder.datetime).toLocaleString()}
                      </span>
                      
                      {reminder.repeat !== 'none' && (
                        <span className="flex items-center text-gray-500">
                          <RefreshCw size={14} className="mr-1" />
                          Repeats {reminder.repeat}
                        </span>
                      )}
                      
                      {overdue && !reminder.completed && (
                        <span className="text-error-600">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                      aria-label="Edit reminder"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                      aria-label="Delete reminder"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default RemindersPage;
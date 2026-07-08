import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit, 
  Tag, 
  Filter, 
  X,
  Search,
  Calendar,
  Smile,
  Meh,
  Frown,
  SmilePlus,
} from 'lucide-react';
import { useData, JournalEntry } from '../contexts/DataContext';
import { useGame, XP_ACTIONS } from '../contexts/GameContext';

const MOOD_OPTIONS = [
  { value: 'great', label: 'Great', icon: <SmilePlus size={18} className="text-success-500" /> },
  { value: 'good', label: 'Good', icon: <Smile size={18} className="text-secondary-500" /> },
  { value: 'okay', label: 'Okay', icon: <Meh size={18} className="text-warning-500" /> },
  { value: 'bad', label: 'Bad', icon: <Frown size={18} className="text-error-400" /> },
  { value: 'terrible', label: 'Terrible', icon: <Frown size={18} className="text-error-600" /> },
];

const JournalsPage: React.FC = () => {
  const { journals, addJournal, updateJournal, deleteJournal } = useData();
  const { addExperience } = useGame();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'bad' | 'terrible'>('good');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(journals.flatMap(journal => journal.tags))
  ).sort();
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('good');
    setTags([]);
    setTagInput('');
    setEditingJournal(null);
    setShowForm(false);
  };
  
  // Load journal for editing
  const handleEdit = (journal: JournalEntry) => {
    setEditingJournal(journal);
    setTitle(journal.title);
    setContent(journal.content);
    setMood(journal.mood);
    setTags(journal.tags);
    setShowForm(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const journalData = {
      title,
      content,
      mood,
      tags,
    };
    
    if (editingJournal) {
      updateJournal(editingJournal.id, journalData);
    } else {
      addJournal(journalData);
      // Add experience for creating a journal entry
      addExperience(XP_ACTIONS.WRITE_JOURNAL, 'WRITE_JOURNAL');
    }
    
    resetForm();
  };
  
  // Handle tag input
  const addTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Get mood icon
  const getMoodIcon = (mood: string) => {
    const option = MOOD_OPTIONS.find(option => option.value === mood);
    return option ? option.icon : <Meh size={18} />;
  };
  
  // Filter journals
  const filteredJournals = journals.filter(journal => {
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesTitle = journal.title.toLowerCase().includes(query);
      const matchesContent = journal.content.toLowerCase().includes(query);
      const matchesTags = journal.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesTitle && !matchesContent && !matchesTags) return false;
    }
    
    // Filter by mood
    if (filterMood && journal.mood !== filterMood) return false;
    
    // Filter by tag
    if (filterTag && !journal.tags.includes(filterTag)) return false;
    
    return true;
  });
  
  // Sort journals by date (newest first)
  const sortedJournals = [...filteredJournals].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
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
            <BookOpen className="mr-2 text-primary-600" size={28} />
            Journal
          </h1>
          <p className="text-gray-600">Reflect on your thoughts and experiences</p>
        </div>
        
        <div className="flex">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mr-2 p-2 btn-ghost rounded-lg"
            aria-label="Filter journals"
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
            <span>New Entry</span>
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
            <h2 className="text-lg font-medium">Filter Journals</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search journals..."
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="select"
              >
                <option value="">All moods</option>
                {MOOD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="select"
              >
                <option value="">All tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
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
              {editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
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
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Journal title"
                  required
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind today?"
                  rows={8}
                  required
                  className="input"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                <div className="flex space-x-2">
                  {MOOD_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMood(option.value as any)}
                      className={`px-3 py-2 rounded-lg flex items-center ${
                        mood === option.value 
                          ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="input mr-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                {editingJournal ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Journal entries */}
      {sortedJournals.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            <BookOpen size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No journal entries found</h3>
          <p className="text-gray-500 mb-4">
            {journals.length === 0
              ? "You haven't created any journal entries yet."
              : "No journal entries match your current filters."}
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            <span>Write your first entry</span>
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {sortedJournals.map((journal) => (
            <motion.div
              key={journal.id}
              variants={item}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-xl text-gray-800">{journal.title}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(journal)}
                      className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                      aria-label="Edit journal"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteJournal(journal.id)}
                      className="p-2 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                      aria-label="Delete journal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date(journal.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    {getMoodIcon(journal.mood)}
                    <span className="ml-1 capitalize">{journal.mood}</span>
                  </div>
                </div>
                
                <div className="text-gray-700 whitespace-pre-line mb-4">
                  {journal.content}
                </div>
                
                {journal.tags.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1">
                    <Tag size={14} className="text-gray-500 mr-1" />
                    {journal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default JournalsPage;
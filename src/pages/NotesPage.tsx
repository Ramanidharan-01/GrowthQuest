import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Edit, 
  Tag, 
  Filter, 
  X,
  Search,
  Palette,
} from 'lucide-react';
import { useData, Note } from '../contexts/DataContext';
import { useGame, XP_ACTIONS } from '../contexts/GameContext';

const COLOR_OPTIONS = [
  { id: 'default', value: '', label: 'Default', class: 'bg-white' },
  { id: 'blue', value: 'blue', label: 'Blue', class: 'bg-blue-50' },
  { id: 'green', value: 'green', label: 'Green', class: 'bg-green-50' },
  { id: 'yellow', value: 'yellow', label: 'Yellow', class: 'bg-yellow-50' },
  { id: 'purple', value: 'purple', label: 'Purple', class: 'bg-purple-50' },
  { id: 'red', value: 'red', label: 'Red', class: 'bg-red-50' },
];

const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useData();
  const { addExperience } = useGame();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterTag, setFilterTag] = useState('');
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  ).sort();
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor('');
    setTags([]);
    setTagInput('');
    setEditingNote(null);
    setShowForm(false);
  };
  
  // Load note for editing
  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || '');
    setTags(note.tags);
    setShowForm(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const noteData = {
      title,
      content,
      color: color || undefined,
      tags,
    };
    
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData);
      // Add experience for creating a note
      addExperience(XP_ACTIONS.CREATE_NOTE, 'CREATE_NOTE');
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
  
  // Get note background color class
  const getNoteColorClass = (noteColor?: string) => {
    if (!noteColor) return 'bg-white';
    const colorOption = COLOR_OPTIONS.find(option => option.value === noteColor);
    return colorOption ? colorOption.class : 'bg-white';
  };
  
  // Filter notes
  const filteredNotes = notes.filter(note => {
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesTitle = note.title.toLowerCase().includes(query);
      const matchesContent = note.content.toLowerCase().includes(query);
      const matchesTags = note.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesTitle && !matchesContent && !matchesTags) return false;
    }
    
    // Filter by color
    if (filterColor && note.color !== filterColor) return false;
    
    // Filter by tag
    if (filterTag && !note.tags.includes(filterTag)) return false;
    
    return true;
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
            <StickyNote className="mr-2 text-warning-500" size={28} />
            Notes
          </h1>
          <p className="text-gray-600">Capture your thoughts and ideas</p>
        </div>
        
        <div className="flex">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mr-2 p-2 btn-ghost rounded-lg"
            aria-label="Filter notes"
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
            <span>Add Note</span>
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
            <h2 className="text-lg font-medium">Filter Notes</h2>
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
                  placeholder="Search notes..."
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                className="select"
              >
                <option value="">All colors</option>
                {COLOR_OPTIONS.slice(1).map(option => (
                  <option key={option.id} value={option.value}>
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
              {editingNote ? 'Edit Note' : 'New Note'}
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
                  placeholder="Note title"
                  required
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Note content"
                  rows={6}
                  required
                  className="input"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Palette size={16} className="mr-1" />
                  Color
                </label>
                <div className="flex space-x-2">
                  {COLOR_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        option.class
                      } ${
                        color === option.value ? 'border-primary-500' : 'border-gray-200'
                      }`}
                      title={option.label}
                    >
                      {color === option.value && (
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                      )}
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
                {editingNote ? 'Update Note' : 'Create Note'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Notes grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            <StickyNote size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No notes found</h3>
          <p className="text-gray-500 mb-4">
            {notes.length === 0
              ? "You haven't created any notes yet."
              : "No notes match your current filters."}
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            <span>Create a new note</span>
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              variants={item}
              className={`p-4 rounded-lg shadow-sm border border-gray-200 ${getNoteColorClass(note.color)} h-full flex flex-col`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 break-words">{note.title}</h3>
                <div className="flex space-x-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1.5 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                    aria-label="Edit note"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1.5 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                    aria-label="Delete note"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-700 whitespace-pre-line break-words">
                  {note.content}
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  
                  {note.tags.length > 0 && (
                    <div className="flex items-center">
                      <Tag size={12} className="mr-1" />
                      <span>{note.tags.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default NotesPage;
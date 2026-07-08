import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  Tag, 
  Filter, 
  X,
  Circle,
  CheckCircle
} from 'lucide-react';
import { useData, Todo } from '../contexts/DataContext';
import { useGame, XP_ACTIONS } from '../contexts/GameContext';

const TodosPage: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoCompleted } = useData();
  const { addExperience } = useGame();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags([]);
    setTagInput('');
    setEditingTodo(null);
    setShowForm(false);
  };
  
  // Load todo for editing
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
    setDueDate(todo.dueDate || '');
    setTags(todo.tags || []);
    setShowForm(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const todoData = {
      title,
      description: description.trim() !== '' ? description : undefined,
      priority,
      dueDate: dueDate !== '' ? dueDate : undefined,
      completed: false,
      tags,
    };
    
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
    } else {
      addTodo(todoData);
      // Add experience for creating a todo
      addExperience(XP_ACTIONS.CREATE_TODO, 'CREATE_TODO');
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
  
  // Handle todo completion
  const handleToggleCompleted = (todo: Todo) => {
    toggleTodoCompleted(todo.id);
    
    // Add experience for completing a todo
    if (!todo.completed) {
      addExperience(XP_ACTIONS.COMPLETE_TODO, 'COMPLETE_TODO');
    }
  };
  
  // Filter todos
  const filteredTodos = todos.filter(todo => {
    // Filter by status
    if (filterStatus === 'completed' && !todo.completed) return false;
    if (filterStatus === 'pending' && todo.completed) return false;
    
    // Filter by priority
    if (filterPriority !== 'all' && todo.priority !== filterPriority) return false;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(query);
      const matchesDescription = todo.description?.toLowerCase().includes(query) || false;
      const matchesTags = todo.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesTitle && !matchesDescription && !matchesTags) return false;
    }
    
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
            <CheckSquare className="mr-2 text-primary-600" size={28} />
            To-Do Lists
          </h1>
          <p className="text-gray-600">Manage your tasks and stay organized</p>
        </div>
        
        <div className="flex">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mr-2 p-2 btn-ghost rounded-lg"
            aria-label="Filter tasks"
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
            <span>Add Task</span>
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
            <h2 className="text-lg font-medium">Filter Tasks</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="select"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="input"
              />
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
              {editingTodo ? 'Edit Task' : 'New Task'}
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
                  placeholder="Task title"
                  required
                  className="input"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                  rows={3}
                  className="input"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="md:col-span-2">
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
                {editingTodo ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Todo list */}
      {filteredTodos.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            <CheckSquare size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {todos.length === 0
              ? "You haven't created any tasks yet."
              : "No tasks match your current filters."}
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            <span>Create a new task</span>
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              variants={item}
              className={`p-4 bg-white rounded-lg shadow-sm border ${
                todo.completed 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <button
                  onClick={() => handleToggleCompleted(todo)}
                  className={`flex-shrink-0 mr-3 ${
                    todo.completed 
                      ? 'text-success-500 hover:text-success-600' 
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                  aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {todo.completed ? (
                    <CheckCircle size={22} />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}>
                    {todo.title}
                  </h3>
                  
                  {todo.description && (
                    <p className={`mt-1 text-sm ${
                      todo.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 space-x-3">
                    {todo.dueDate && (
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    
                    <span className={`badge ${
                      todo.priority === 'high' 
                        ? 'bg-error-100 text-error-800' 
                        : todo.priority === 'medium'
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-success-100 text-success-800'
                    }`}>
                      {todo.priority}
                    </span>
                    
                    {todo.tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1 mt-1 md:mt-0">
                        <Tag size={14} className="mr-1" />
                        {todo.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-gray-100 px-2 py-0.5 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                    aria-label="Edit task"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                    aria-label="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TodosPage;
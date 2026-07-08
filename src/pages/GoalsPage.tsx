import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  CheckCircle,
  Circle,
  List,
  X,
  Filter,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useData, Goal } from '../contexts/DataContext';
import { useGame, XP_ACTIONS } from '../contexts/GameContext';

const CATEGORY_OPTIONS = [
  'Personal',
  'Health',
  'Career',
  'Financial',
  'Learning',
  'Relationships',
  'Other'
];

const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoalCompleted, addMilestone, updateMilestone, deleteMilestone } = useData();
  const { addExperience } = useGame();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [milestones, setMilestones] = useState<{id?: string, title: string, completed: boolean}[]>([]);
  const [milestoneInput, setMilestoneInput] = useState('');
  
  // UI state
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setCategory(CATEGORY_OPTIONS[0]);
    setMilestones([]);
    setMilestoneInput('');
    setEditingGoal(null);
    setShowForm(false);
  };
  
  // Load goal for editing
  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setDeadline(goal.deadline || '');
    setCategory(goal.category);
    setMilestones(goal.milestones || []);
    setShowForm(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      title,
      description: description.trim() !== '' ? description : undefined,
      deadline: deadline !== '' ? deadline : undefined,
      completed: false,
      category,
      milestones,
    };
    
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
      // Add experience for creating a goal
      addExperience(XP_ACTIONS.CREATE_GOAL, 'CREATE_GOAL');
    }
    
    resetForm();
  };
  
  // Handle milestone input
  const addMilestoneToForm = () => {
    if (milestoneInput.trim() !== '') {
      setMilestones([...milestones, { title: milestoneInput.trim(), completed: false }]);
      setMilestoneInput('');
    }
  };
  
  const removeMilestoneFromForm = (indexToRemove: number) => {
    setMilestones(milestones.filter((_, index) => index !== indexToRemove));
  };
  
  const toggleMilestoneCompletedInForm = (indexToToggle: number) => {
    setMilestones(
      milestones.map((milestone, index) => 
        index === indexToToggle 
          ? { ...milestone, completed: !milestone.completed } 
          : milestone
      )
    );
  };
  
  // Handle goal completion
  const handleToggleCompleted = (goal: Goal) => {
    toggleGoalCompleted(goal.id);
    
    // Add experience for completing a goal
    if (!goal.completed) {
      addExperience(XP_ACTIONS.ACHIEVE_GOAL, 'ACHIEVE_GOAL');
    }
  };
  
  // Handle milestone operations
  const handleAddMilestone = (goalId: string) => {
    if (milestoneInput.trim() !== '') {
      addMilestone(goalId, milestoneInput);
      setMilestoneInput('');
    }
  };
  
  const handleToggleMilestoneCompleted = (goalId: string, milestoneId: string, completed: boolean) => {
    updateMilestone(goalId, milestoneId, !completed);
  };
  
  const handleDeleteMilestone = (goalId: string, milestoneId: string) => {
    deleteMilestone(goalId, milestoneId);
  };
  
  // Toggle goal expansion
  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };
  
  // Filter goals
  const filteredGoals = goals.filter(goal => {
    // Filter by status
    if (filterStatus === 'completed' && !goal.completed) return false;
    if (filterStatus === 'in-progress' && goal.completed) return false;
    
    // Filter by category
    if (filterCategory && goal.category !== filterCategory) return false;
    
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
            <Target className="mr-2 text-accent-500" size={28} />
            Goals
          </h1>
          <p className="text-gray-600">Set and track your personal objectives</p>
        </div>
        
        <div className="flex">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mr-2 p-2 btn-ghost rounded-lg"
            aria-label="Filter goals"
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
            <span>Add Goal</span>
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
            <h2 className="text-lg font-medium">Filter Goals</h2>
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
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select"
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
              {editingGoal ? 'Edit Goal' : 'New Goal'}
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
                  placeholder="Goal title"
                  required
                  className="input"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goal description"
                  rows={3}
                  className="input"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (optional)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select"
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Milestones</label>
                <div className="flex">
                  <input
                    type="text"
                    value={milestoneInput}
                    onChange={(e) => setMilestoneInput(e.target.value)}
                    placeholder="Add a milestone"
                    className="input mr-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addMilestoneToForm();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addMilestoneToForm}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
                
                {milestones.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 bg-gray-50 rounded-lg"
                      >
                        <button
                          type="button"
                          onClick={() => toggleMilestoneCompletedInForm(index)}
                          className={`flex-shrink-0 mr-2 ${
                            milestone.completed 
                              ? 'text-success-500 hover:text-success-600' 
                              : 'text-gray-400 hover:text-gray-500'
                          }`}
                          aria-label={milestone.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {milestone.completed ? (
                            <CheckCircle size={18} />
                          ) : (
                            <Circle size={18} />
                          )}
                        </button>
                        <span className={`flex-1 ${
                          milestone.completed ? 'line-through text-gray-500' : ''
                        }`}>
                          {milestone.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMilestoneFromForm(index)}
                          className="ml-2 text-gray-500 hover:text-error-600"
                          aria-label="Remove milestone"
                        >
                          <X size={16} />
                        </button>
                      </div>
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
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Goals list */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            <Target size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No goals found</h3>
          <p className="text-gray-500 mb-4">
            {goals.length === 0
              ? "You haven't created any goals yet."
              : "No goals match your current filters."}
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            <span>Create a new goal</span>
          </button>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredGoals.map((goal) => (
            <motion.div
              key={goal.id}
              variants={item}
              className={`bg-white rounded-lg shadow-sm border ${
                goal.completed 
                  ? 'border-success-200 bg-success-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <button
                    onClick={() => handleToggleCompleted(goal)}
                    className={`flex-shrink-0 mt-1 mr-3 ${
                      goal.completed 
                        ? 'text-success-500 hover:text-success-600' 
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                    aria-label={goal.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {goal.completed ? (
                      <CheckCircle size={22} />
                    ) : (
                      <Circle size={22} />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center mb-2">
                      <h3 className={`font-medium text-lg mr-2 ${
                        goal.completed ? 'text-success-700' : 'text-gray-800'
                      }`}>
                        {goal.title}
                      </h3>
                      <span className="badge badge-accent">
                        {goal.category}
                      </span>
                    </div>
                    
                    {goal.description && (
                      <p className={`mb-2 ${
                        goal.completed ? 'text-success-600' : 'text-gray-600'
                      }`}>
                        {goal.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
                      {goal.deadline && (
                        <div className="flex items-center mr-4">
                          <Calendar size={14} className="mr-1" />
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <TrendingUp size={14} className="mr-1" />
                        <span>Progress: {goal.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.completed 
                            ? 'bg-success-500' 
                            : 'bg-accent-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleGoalExpanded(goal.id)}
                        className={`inline-flex items-center text-sm ${
                          expandedGoalId === goal.id
                            ? 'text-primary-600'
                            : 'text-gray-500 hover:text-primary-600'
                        }`}
                      >
                        <List size={16} className="mr-1" />
                        <span>Milestones ({goal.milestones.length})</span>
                        {expandedGoalId === goal.id ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )}
                      </button>
                      
                      <div className="ml-auto flex space-x-1">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                          aria-label="Edit goal"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-2 text-gray-500 hover:text-error-600 rounded-full hover:bg-gray-100"
                          aria-label="Delete goal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Milestones section */}
              {expandedGoalId === goal.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Milestones</h4>
                  
                  {goal.milestones.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center p-2 bg-white rounded-lg border border-gray-100"
                        >
                          <button
                            onClick={() => handleToggleMilestoneCompleted(goal.id, milestone.id, milestone.completed)}
                            className={`flex-shrink-0 mr-2 ${
                              milestone.completed 
                                ? 'text-success-500 hover:text-success-600' 
                                : 'text-gray-400 hover:text-gray-500'
                            }`}
                            aria-label={milestone.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {milestone.completed ? (
                              <CheckCircle size={18} />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>
                          <span className={`flex-1 ${
                            milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'
                          }`}>
                            {milestone.title}
                          </span>
                          <button
                            onClick={() => handleDeleteMilestone(goal.id, milestone.id)}
                            className="ml-2 text-gray-500 hover:text-error-600"
                            aria-label="Remove milestone"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">No milestones added yet.</p>
                  )}
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={milestoneInput}
                      onChange={(e) => setMilestoneInput(e.target.value)}
                      placeholder="Add a milestone"
                      className="input text-sm py-1.5 mr-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestone(goal.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMilestone(goal.id)}
                      className="btn-secondary text-sm py-1.5 px-3"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GoalsPage;
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Award, 
  Book,
  Calendar,
  Clock,
  Target,
  StickyNote
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useGame } from '../contexts/GameContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    todos, 
    notes, 
    goals, 
    journals, 
    reminders, 
    dailyQuote, 
    taskSuggestions 
  } = useData();
  const { level, experience, nextLevelXp, progress, achievements } = useGame();
  
  // Refresh achievements
  const { checkAchievements } = useGame();
  useEffect(() => {
    checkAchievements();
  }, []);
  
  if (!user) return null;
  
  // Calculate stats
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = todos.filter(todo => !todo.completed).length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  const pendingGoals = goals.filter(goal => !goal.completed).length;
  const journalEntries = journals.length;
  const pendingReminders = reminders.filter(reminder => !reminder.completed && new Date(reminder.datetime) > new Date()).length;
  
  // Today's date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Get random task suggestion
  const randomTaskSuggestion = taskSuggestions[Math.floor(Math.random() * taskSuggestions.length)];
  
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
    <div className="container mx-auto max-w-6xl">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-4 grid-cols-1"
      >
        {/* Welcome section */}
        <motion.div 
          variants={item}
          className="md:col-span-3 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-primary-100 mb-4">{formattedDate}</p>
              <div className="flex items-center space-x-1 mb-6">
                <Award className="text-primary-200" size={20} />
                <span className="text-primary-100">Level {level} • {experience}/{nextLevelXp} XP</span>
              </div>
              <div className="w-full max-w-md h-2 bg-primary-400 rounded-full mb-1">
                <div 
                  className="h-2 bg-primary-100 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles size={36} className="text-primary-200" />
            </motion.div>
          </div>
        </motion.div>

        {/* Quote of the day */}
        <motion.div 
          variants={item}
          className="md:col-span-1 card p-4 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Quote of the Day</h3>
            <p className="text-gray-700 italic">"{dailyQuote.text}"</p>
          </div>
          <p className="text-right text-sm text-gray-500 mt-3">— {dailyQuote.author}</p>
        </motion.div>
        
        {/* Stats summary */}
        <motion.div 
          variants={item}
          className="md:col-span-2 card p-5"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 size={18} className="mr-2 text-primary-600" />
            Your Progress
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tasks</span>
                <CheckCircle2 size={16} className="text-success-500" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-2xl font-semibold">{completedTodos}</span>
                <span className="text-sm text-gray-500 self-end">/{todos.length}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Goals</span>
                <Target size={16} className="text-accent-500" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-2xl font-semibold">{completedGoals}</span>
                <span className="text-sm text-gray-500 self-end">/{goals.length}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Journal Entries</span>
                <Book size={16} className="text-primary-500" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-semibold">{journalEntries}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Reminders</span>
                <Clock size={16} className="text-warning-500" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-semibold">{pendingReminders}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Recent achievements */}
        <motion.div 
          variants={item}
          className="md:col-span-2 card p-5"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Award size={18} className="mr-2 text-accent-500" />
            Recent Achievements
          </h2>
          
          <div className="space-y-3">
            {achievements.filter(a => a.unlocked).length > 0 ? (
              achievements
                .filter(a => a.unlocked)
                .slice(0, 3)
                .map(achievement => (
                  <div 
                    key={achievement.id}
                    className="flex items-center p-3 bg-accent-50 rounded-lg border border-accent-100"
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
              <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                <p className="mb-2">No achievements unlocked yet</p>
                <p className="text-sm">Complete tasks and activities to earn achievements!</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Tasks for today */}
        <motion.div 
          variants={item}
          className="md:col-span-2 card p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <CheckCircle2 size={18} className="mr-2 text-primary-600" />
              Today's Tasks
            </h2>
            <Link to="/todos" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-2 mb-4">
            {todos.filter(todo => !todo.completed).length > 0 ? (
              todos
                .filter(todo => !todo.completed)
                .slice(0, 3)
                .map(todo => (
                  <div 
                    key={todo.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="mr-3">
                      <Circle size={18} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{todo.title}</h4>
                      {todo.dueDate && (
                        <p className="text-xs text-gray-500">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={`badge ${
                        todo.priority === 'high' 
                          ? 'bg-error-100 text-error-800' 
                          : todo.priority === 'medium'
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-success-100 text-success-800'
                      }`}>
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                <p>No pending tasks</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Suggested Task</h3>
            <div className="p-3 bg-primary-50 rounded-lg">
              <p className="text-primary-700">{randomTaskSuggestion}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Goals progress */}
        <motion.div 
          variants={item}
          className="md:col-span-2 card p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Target size={18} className="mr-2 text-accent-500" />
              Goal Progress
            </h2>
            <Link to="/goals" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          
          {goals.filter(goal => !goal.completed).length > 0 ? (
            <div className="space-y-4">
              {goals
                .filter(goal => !goal.completed)
                .slice(0, 2)
                .map(goal => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{goal.title}</h4>
                      <span className="text-sm text-gray-500">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-accent-500 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              <p className="mb-2">No active goals</p>
              <Link to="/goals" className="text-primary-600 text-sm hover:underline">
                Create a new goal
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Upcoming reminders */}
        <motion.div 
          variants={item}
          className="md:col-span-2 card p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Calendar size={18} className="mr-2 text-secondary-600" />
              Upcoming
            </h2>
            <Link to="/reminders" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          
          {reminders.filter(reminder => !reminder.completed && new Date(reminder.datetime) > new Date()).length > 0 ? (
            <div className="space-y-3">
              {reminders
                .filter(reminder => !reminder.completed && new Date(reminder.datetime) > new Date())
                .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                .slice(0, 3)
                .map(reminder => (
                  <div 
                    key={reminder.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 mr-3">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium">{reminder.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(reminder.datetime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              <p>No upcoming reminders</p>
            </div>
          )}
        </motion.div>
        
        {/* Recent notes */}
        <motion.div 
          variants={item}
          className="md:col-span-2 card p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <StickyNote size={18} className="mr-2 text-warning-500" />
              Recent Notes
            </h2>
            <Link to="/notes" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 2)
                .map(note => (
                  <div 
                    key={note.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-medium mb-1">{note.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              <p>No notes created yet</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
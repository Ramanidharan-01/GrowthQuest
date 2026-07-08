import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Task types
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  tags: string[];
}

// Note types
export interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// Goal types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  deadline?: string;
  createdAt: string;
  progress: number;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  category: string;
}

// Journal types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  createdAt: string;
  tags: string[];
}

// Reminder types
export interface Reminder {
  id: string;
  title: string;
  description?: string;
  datetime: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  createdAt: string;
}

// Quotes
export interface Quote {
  id: string;
  text: string;
  author: string;
}

interface DataContextType {
  todos: Todo[];
  notes: Note[];
  goals: Goal[];
  journals: JournalEntry[];
  reminders: Reminder[];
  dailyQuote: Quote;
  taskSuggestions: string[];
  
  // Todos
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompleted: (id: string) => void;
  
  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalCompleted: (id: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  updateMilestone: (goalId: string, milestoneId: string, completed: boolean) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  
  // Journals
  addJournal: (journal: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournal: (id: string, journal: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  
  // Reminders
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderCompleted: (id: string) => void;
  
  // Refresh for consistency
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dailyQuote, setDailyQuote] = useState<Quote>({
    id: '1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  });
  const [taskSuggestions, setTaskSuggestions] = useState<string[]>([
    'Take a 5-minute mindfulness break',
    'Drink a glass of water',
    'Do 10 push-ups or stretches',
    'Write down 3 things you\'re grateful for',
    'Read one page of a book',
    'Clear your desk of clutter',
    'Take a short walk outside',
    'Learn one new word in another language'
  ]);

  // Load data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedTodos = localStorage.getItem(`growthQuest_todos_${user.id}`);
      if (storedTodos) setTodos(JSON.parse(storedTodos));

      const storedNotes = localStorage.getItem(`growthQuest_notes_${user.id}`);
      if (storedNotes) setNotes(JSON.parse(storedNotes));

      const storedGoals = localStorage.getItem(`growthQuest_goals_${user.id}`);
      if (storedGoals) setGoals(JSON.parse(storedGoals));

      const storedJournals = localStorage.getItem(`growthQuest_journals_${user.id}`);
      if (storedJournals) setJournals(JSON.parse(storedJournals));

      const storedReminders = localStorage.getItem(`growthQuest_reminders_${user.id}`);
      if (storedReminders) setReminders(JSON.parse(storedReminders));
    } else {
      // Clear data when user logs out
      setTodos([]);
      setNotes([]);
      setGoals([]);
      setJournals([]);
      setReminders([]);
    }

    // Set daily quote
    const quotes = [
      { id: '1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { id: '2', text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
      { id: '3', text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
      { id: '4', text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', author: 'Winston Churchill' },
      { id: '5', text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
      { id: '6', text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
      { id: '7', text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
      { id: '8', text: 'Whether you think you can or you think you can\'t, you\'re right.', author: 'Henry Ford' },
      { id: '9', text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
      { id: '10', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    ];
    
    // Use the current date to select a quote (ensures the same quote all day)
    const today = new Date().toDateString();
    const quoteIndex = today.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % quotes.length;
    setDailyQuote(quotes[quoteIndex]);
  }, [user]);

  // Todos CRUD
  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newTodo: Todo = {
      ...todo,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem(`growthQuest_todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  const updateTodo = (id: string, todoUpdate: Partial<Todo>) => {
    if (!user) return;
    
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, ...todoUpdate } : todo
    );
    
    setTodos(updatedTodos);
    localStorage.setItem(`growthQuest_todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id: string) => {
    if (!user) return;
    
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem(`growthQuest_todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  const toggleTodoCompleted = (id: string) => {
    if (!user) return;
    
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setTodos(updatedTodos);
    localStorage.setItem(`growthQuest_todos_${user.id}`, JSON.stringify(updatedTodos));
  };

  // Notes CRUD
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`growthQuest_notes_${user.id}`, JSON.stringify(updatedNotes));
  };

  const updateNote = (id: string, noteUpdate: Partial<Note>) => {
    if (!user) return;
    
    const updatedNotes = notes.map(note => 
      note.id === id ? { 
        ...note, 
        ...noteUpdate, 
        updatedAt: new Date().toISOString() 
      } : note
    );
    
    setNotes(updatedNotes);
    localStorage.setItem(`growthQuest_notes_${user.id}`, JSON.stringify(updatedNotes));
  };

  const deleteNote = (id: string) => {
    if (!user) return;
    
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`growthQuest_notes_${user.id}`, JSON.stringify(updatedNotes));
  };

  // Goals CRUD
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => {
    if (!user) return;
    
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      progress: 0,
    };
    
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem(`growthQuest_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const updateGoal = (id: string, goalUpdate: Partial<Goal>) => {
    if (!user) return;
    
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, ...goalUpdate } : goal
    );
    
    setGoals(updatedGoals);
    localStorage.setItem(`growthQuest_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const deleteGoal = (id: string) => {
    if (!user) return;
    
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem(`growthQuest_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const toggleGoalCompleted = (id: string) => {
    if (!user) return;
    
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { 
        ...goal, 
        completed: !goal.completed,
        progress: !goal.completed ? 100 : calculateGoalProgress(goal)
      } : goal
    );
    
    setGoals(updatedGoals);
    localStorage.setItem(`growthQuest_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const calculateGoalProgress = (goal: Goal): number => {
    if (goal.milestones.length === 0) return 0;
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    return Math.round((completedMilestones / goal.milestones.length) * 100);
  };

  const addMilestone = (goalId: string, title: string) => {
    if (!user) return;
    
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = [
          ...goal.milestones,
          { id: uuidv4(), title, completed: false }
        ];
        const progress = calculateGoalProgress({ ...goal, milestones: updatedMilestones });
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    localStorage.setItem(`growthQuest_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const updateMilestone = (goalId: string, milestoneId: string, completed: boolean) => {
    if (!user) return;
    
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => 
          milestone.id === milestoneId ? { ...milestone, completed } : milestone
        );
        const progress = calculateGoalProgress({ ...goal, milestones: updatedMilestones });
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          // If all milestones are completed, mark the goal as completed
          completed: updatedMilestones.every(m => m.completed)
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    localStorage.setItem(`growthQuest_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    if (!user) return;
    
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.filter(
          milestone => milestone.id !== milestoneId
        );
        const progress = calculateGoalProgress({ ...goal, milestones: updatedMilestones });
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    localStorage.setItem(`growthQuest_goals_${user.id}`, JSON.stringify(updatedGoals));
  };

  // Journals CRUD
  const addJournal = (journal: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newJournal: JournalEntry = {
      ...journal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedJournals = [...journals, newJournal];
    setJournals(updatedJournals);
    localStorage.setItem(`growthQuest_journals_${user.id}`, JSON.stringify(updatedJournals));
  };

  const updateJournal = (id: string, journalUpdate: Partial<JournalEntry>) => {
    if (!user) return;
    
    const updatedJournals = journals.map(journal => 
      journal.id === id ? { ...journal, ...journalUpdate } : journal
    );
    
    setJournals(updatedJournals);
    localStorage.setItem(`growthQuest_journals_${user.id}`, JSON.stringify(updatedJournals));
  };

  const deleteJournal = (id: string) => {
    if (!user) return;
    
    const updatedJournals = journals.filter(journal => journal.id !== id);
    setJournals(updatedJournals);
    localStorage.setItem(`growthQuest_journals_${user.id}`, JSON.stringify(updatedJournals));
  };

  // Reminders CRUD
  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) => {
    if (!user) return;
    
    const newReminder: Reminder = {
      ...reminder,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem(`growthQuest_reminders_${user.id}`, JSON.stringify(updatedReminders));
  };

  const updateReminder = (id: string, reminderUpdate: Partial<Reminder>) => {
    if (!user) return;
    
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, ...reminderUpdate } : reminder
    );
    
    setReminders(updatedReminders);
    localStorage.setItem(`growthQuest_reminders_${user.id}`, JSON.stringify(updatedReminders));
  };

  const deleteReminder = (id: string) => {
    if (!user) return;
    
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem(`growthQuest_reminders_${user.id}`, JSON.stringify(updatedReminders));
  };

  const toggleReminderCompleted = (id: string) => {
    if (!user) return;
    
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    );
    
    setReminders(updatedReminders);
    localStorage.setItem(`growthQuest_reminders_${user.id}`, JSON.stringify(updatedReminders));
  };

  // Refresh data - useful for ensuring consistency after operations
  const refreshData = () => {
    if (!user) return;
    
    const storedTodos = localStorage.getItem(`growthQuest_todos_${user.id}`);
    if (storedTodos) setTodos(JSON.parse(storedTodos));

    const storedNotes = localStorage.getItem(`growthQuest_notes_${user.id}`);
    if (storedNotes) setNotes(JSON.parse(storedNotes));

    const storedGoals = localStorage.getItem(`growthQuest_goals_${user.id}`);
    if (storedGoals) setGoals(JSON.parse(storedGoals));

    const storedJournals = localStorage.getItem(`growthQuest_journals_${user.id}`);
    if (storedJournals) setJournals(JSON.parse(storedJournals));

    const storedReminders = localStorage.getItem(`growthQuest_reminders_${user.id}`);
    if (storedReminders) setReminders(JSON.parse(storedReminders));
  };

  const value = {
    todos,
    notes,
    goals,
    journals,
    reminders,
    dailyQuote,
    taskSuggestions,
    
    // Todos
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompleted,
    
    // Notes
    addNote,
    updateNote,
    deleteNote,
    
    // Goals
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalCompleted,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    
    // Journals
    addJournal,
    updateJournal,
    deleteJournal,
    
    // Reminders
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderCompleted,
    
    // Refresh
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
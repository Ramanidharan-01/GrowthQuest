import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Constants for the gamification system
const XP_PER_LEVEL = 100;
const LEVEL_MULTIPLIER = 1.5;

// Actions that earn XP
export const XP_ACTIONS = {
  CREATE_TODO: 10,
  COMPLETE_TODO: 20,
  CREATE_GOAL: 15,
  ACHIEVE_GOAL: 50,
  CREATE_NOTE: 5,
  WRITE_JOURNAL: 15,
  LOGIN_STREAK: 10,
  SET_REMINDER: 5,
  COMPLETE_PROFILE: 30,
};

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface GameContextType {
  level: number;
  experience: number;
  nextLevelXp: number;
  progress: number;
  achievements: Achievement[];
  addExperience: (amount: number, action: string) => void;
  checkAchievements: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Calculate XP needed for next level
  const calculateNextLevelXp = (currentLevel: number): number => {
    return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, currentLevel - 1));
  };

  const nextLevelXp = calculateNextLevelXp(level);
  const progress = experience / nextLevelXp * 100;

  useEffect(() => {
    // Initialize from user data if available
    if (user) {
      setLevel(user.level || 1);
      setExperience(user.experience || 0);
    }
    
    // Load achievements from localStorage
    const storedAchievements = localStorage.getItem(`growthQuest_achievements_${user?.id}`);
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    } else {
      // Initialize default achievements
      const defaultAchievements: Achievement[] = [
        {
          id: 'first_todo',
          title: 'Task Master',
          description: 'Create your first todo item',
          icon: 'check-circle',
          unlocked: false,
          progress: 0,
          maxProgress: 1,
        },
        {
          id: 'complete_5_todos',
          title: 'Productivity Pro',
          description: 'Complete 5 todo items',
          icon: 'list-checks',
          unlocked: false,
          progress: 0,
          maxProgress: 5,
        },
        {
          id: 'first_goal',
          title: 'Goal Setter',
          description: 'Set your first goal',
          icon: 'target',
          unlocked: false,
          progress: 0,
          maxProgress: 1,
        },
        {
          id: 'first_journal',
          title: 'Dear Diary',
          description: 'Write your first journal entry',
          icon: 'book',
          unlocked: false,
          progress: 0,
          maxProgress: 1,
        },
        {
          id: 'streak_3',
          title: 'Consistency is Key',
          description: 'Login 3 days in a row',
          icon: 'flame',
          unlocked: false,
          progress: 0,
          maxProgress: 3,
        },
      ];
      setAchievements(defaultAchievements);
      if (user) {
        localStorage.setItem(`growthQuest_achievements_${user.id}`, JSON.stringify(defaultAchievements));
      }
    }
  }, [user]);

  // Add experience and level up if necessary
  const addExperience = (amount: number, action: string) => {
    if (!user) return;
    
    let newExperience = experience + amount;
    let newLevel = level;
    
    // Check if level up
    while (newExperience >= nextLevelXp) {
      newExperience -= nextLevelXp;
      newLevel++;
    }
    
    // Update state
    setExperience(newExperience);
    setLevel(newLevel);
    
    // Update user profile
    updateProfile({ level: newLevel, experience: newExperience });
    
    // Update achievements based on action
    updateAchievementProgress(action);
  };

  // Update achievement progress based on action
  const updateAchievementProgress = (action: string) => {
    if (!user) return;
    
    const updatedAchievements = [...achievements];
    
    switch (action) {
      case 'CREATE_TODO':
        // Update first_todo achievement
        const firstTodoAchievement = updatedAchievements.find(a => a.id === 'first_todo');
        if (firstTodoAchievement && !firstTodoAchievement.unlocked) {
          firstTodoAchievement.progress = 1;
          firstTodoAchievement.unlocked = true;
        }
        break;
      case 'COMPLETE_TODO':
        // Update complete_5_todos achievement
        const completeTodosAchievement = updatedAchievements.find(a => a.id === 'complete_5_todos');
        if (completeTodosAchievement && !completeTodosAchievement.unlocked) {
          completeTodosAchievement.progress += 1;
          if (completeTodosAchievement.progress >= completeTodosAchievement.maxProgress) {
            completeTodosAchievement.unlocked = true;
          }
        }
        break;
      case 'CREATE_GOAL':
        // Update first_goal achievement
        const firstGoalAchievement = updatedAchievements.find(a => a.id === 'first_goal');
        if (firstGoalAchievement && !firstGoalAchievement.unlocked) {
          firstGoalAchievement.progress = 1;
          firstGoalAchievement.unlocked = true;
        }
        break;
      case 'WRITE_JOURNAL':
        // Update first_journal achievement
        const firstJournalAchievement = updatedAchievements.find(a => a.id === 'first_journal');
        if (firstJournalAchievement && !firstJournalAchievement.unlocked) {
          firstJournalAchievement.progress = 1;
          firstJournalAchievement.unlocked = true;
        }
        break;
      case 'LOGIN_STREAK':
        // Update streak_3 achievement
        const streakAchievement = updatedAchievements.find(a => a.id === 'streak_3');
        if (streakAchievement && !streakAchievement.unlocked) {
          streakAchievement.progress += 1;
          if (streakAchievement.progress >= streakAchievement.maxProgress) {
            streakAchievement.unlocked = true;
          }
        }
        break;
      default:
        break;
    }
    
    // Save updated achievements
    setAchievements(updatedAchievements);
    localStorage.setItem(`growthQuest_achievements_${user.id}`, JSON.stringify(updatedAchievements));
  };

  // Check all achievements to update progress
  const checkAchievements = () => {
    if (!user) return;
    
    // Get todos data
    const todos = JSON.parse(localStorage.getItem(`growthQuest_todos_${user.id}`) || '[]');
    const completedTodos = todos.filter((todo: any) => todo.completed).length;
    
    // Get goals data
    const goals = JSON.parse(localStorage.getItem(`growthQuest_goals_${user.id}`) || '[]');
    
    // Get journals data
    const journals = JSON.parse(localStorage.getItem(`growthQuest_journals_${user.id}`) || '[]');
    
    // Update achievements based on data
    const updatedAchievements = [...achievements];
    
    // First todo achievement
    const firstTodoAchievement = updatedAchievements.find(a => a.id === 'first_todo');
    if (firstTodoAchievement && !firstTodoAchievement.unlocked && todos.length > 0) {
      firstTodoAchievement.progress = 1;
      firstTodoAchievement.unlocked = true;
    }
    
    // Complete 5 todos achievement
    const completeTodosAchievement = updatedAchievements.find(a => a.id === 'complete_5_todos');
    if (completeTodosAchievement) {
      completeTodosAchievement.progress = Math.min(completedTodos, completeTodosAchievement.maxProgress);
      completeTodosAchievement.unlocked = completeTodosAchievement.progress >= completeTodosAchievement.maxProgress;
    }
    
    // First goal achievement
    const firstGoalAchievement = updatedAchievements.find(a => a.id === 'first_goal');
    if (firstGoalAchievement && !firstGoalAchievement.unlocked && goals.length > 0) {
      firstGoalAchievement.progress = 1;
      firstGoalAchievement.unlocked = true;
    }
    
    // First journal achievement
    const firstJournalAchievement = updatedAchievements.find(a => a.id === 'first_journal');
    if (firstJournalAchievement && !firstJournalAchievement.unlocked && journals.length > 0) {
      firstJournalAchievement.progress = 1;
      firstJournalAchievement.unlocked = true;
    }
    
    // Save updated achievements
    setAchievements(updatedAchievements);
    localStorage.setItem(`growthQuest_achievements_${user.id}`, JSON.stringify(updatedAchievements));
  };

  const value = {
    level,
    experience,
    nextLevelXp,
    progress,
    achievements,
    addExperience,
    checkAchievements,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
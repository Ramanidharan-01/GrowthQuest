import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TodosPage from './pages/TodosPage';
import NotesPage from './pages/NotesPage';
import GoalsPage from './pages/GoalsPage';
import JournalsPage from './pages/JournalsPage';
import RemindersPage from './pages/RemindersPage';

// Layout
import Layout from './components/layout/Layout';

function App() {
  return (
    <Routes >
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route  element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/journals" element={<JournalsPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
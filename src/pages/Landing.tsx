import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rocket, Target, Book, Calendar, CheckSquare } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary-900 mb-4">
            Welcome to GrowthQuest
          </h1>
          <p className="text-xl text-primary-700 max-w-2xl mx-auto">
            Your personal growth companion. Track goals, manage tasks, journal your thoughts, and stay organized on your journey to self-improvement.
          </p>
          {!user && (
            <div className="mt-8 space-x-4">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-3"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn-ghost text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </div>
          )}
          {user && (
            <Link
              to="/dashboard"
              className="btn-primary text-lg px-8 py-3 mt-8 inline-block"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="card p-6">
            <Target className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
            <p className="text-gray-600">
              Set meaningful goals and track your progress with milestones.
            </p>
          </div>
          
          <div className="card p-6">
            <CheckSquare className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">
              Stay organized with a powerful todo system and task prioritization.
            </p>
          </div>
          
          <div className="card p-6">
            <Book className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Journal Entries</h3>
            <p className="text-gray-600">
              Document your journey and reflect on your personal growth.
            </p>
          </div>
          
          <div className="card p-6">
            <Calendar className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">
              Never miss important deadlines with customizable reminders.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-900 mb-4">
            Start Your Growth Journey Today
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto mb-8">
            Join thousands of users who are already achieving their goals and improving their lives with GrowthQuest.
          </p>
          {!user && (
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
            >
              <Rocket className="w-5 h-5" />
              <span>Begin Your Quest</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
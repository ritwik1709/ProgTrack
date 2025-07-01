import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-80 max-w-xs md:max-w-md lg:max-w-lg">
    <ellipse cx="250" cy="420" rx="200" ry="30" className="fill-indigo-100 dark:fill-gray-800" />
    <rect x="120" y="120" width="260" height="180" rx="24" className="fill-indigo-500" />
    <rect x="140" y="140" width="220" height="40" rx="8" className="fill-white dark:fill-gray-900" />
    <rect x="140" y="200" width="160" height="20" rx="6" className="fill-indigo-200 dark:fill-indigo-600" />
    <rect x="140" y="230" width="120" height="20" rx="6" className="fill-indigo-200 dark:fill-indigo-600" />
    <circle cx="370" cy="220" r="18" className="fill-white dark:fill-gray-900" />
    <circle cx="370" cy="220" r="10" className="fill-indigo-500 dark:fill-white" />
    <rect x="180" y="270" width="100" height="10" rx="5" className="fill-white dark:fill-gray-900" />
  </svg>
);

const features = [
  {
    title: 'Project & Task Management',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#6366F1" strokeWidth="2"/><path d="M7 9h10M7 13h6" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    desc: 'Create projects, add tasks, and organize your workflow.'
  },
  {
    title: 'Drag & Drop Board',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#6366F1" strokeWidth="2"/><path d="M8 8h8v8H8z" fill="#6366F1"/></svg>
    ),
    desc: 'Move tasks between stages with a beautiful drag-and-drop board.'
  },
  {
    title: 'Team Collaboration',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="8" r="4" stroke="#6366F1" strokeWidth="2"/><circle cx="16" cy="16" r="4" stroke="#6366F1" strokeWidth="2"/><path d="M12 12l2 2" stroke="#6366F1" strokeWidth="2"/></svg>
    ),
    desc: 'Invite teammates, assign roles (Owner, Member, Viewer), and manage members.'
  },
  {
    title: 'Dark Mode',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#6366F1"/></svg>
    ),
    desc: 'Switch between light and dark themes for comfort and style.'
  },
  {
    title: 'Responsive Design',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="4" stroke="#6366F1" strokeWidth="2"/><rect x="7" y="2" width="10" height="5" rx="2" stroke="#6366F1" strokeWidth="2"/></svg>
    ),
    desc: 'Looks great on desktop, tablet, and mobile.'
  },
];

const steps = [
  {
    title: 'Sign Up',
    desc: 'Create your free account in seconds.'
  },
  {
    title: 'Create a Project',
    desc: 'Start a new project for your team or yourself.'
  },
  {
    title: 'Invite & Manage Members',
    desc: 'Add teammates, assign roles, and collaborate.'
  },
  {
    title: 'Track Progress',
    desc: 'Organize tasks, move them across stages, and get things done!'
  },
];

const Home = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center bg-white dark:bg-gray-900 transition-colors duration-200 py-12 px-4">
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center max-w-6xl w-full gap-12 md:gap-20 mt-8">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-4 text-center md:text-left leading-tight">Welcome to ProgTrack</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 text-center md:text-left mb-8 max-w-xl">Organize your projects, manage tasks, and collaborate with your team. Simple, fast, and beautiful project management for everyone.</p>
          {user ? (
            <>
              <div className="text-lg text-gray-700 dark:text-gray-200 mb-6 text-center md:text-left">Hi, <span className="font-semibold">{user.username}</span>! Ready to get productive?</div>
              <button
                onClick={() => navigate('/projects')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
              >
                Go to Projects
              </button>
            </>
          ) : (
            <div className="flex gap-6 mt-2 justify-center md:justify-start">
              <Link to="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition">Login</Link>
              <Link to="/register" className="bg-white border border-indigo-600 text-indigo-700 px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-indigo-50 dark:bg-gray-900 dark:border-indigo-400 dark:text-indigo-200 dark:hover:bg-gray-800 transition">Register</Link>
            </div>
          )}
        </div>
        <div className="flex-1 flex justify-center mb-10 md:mb-0">
          <HeroSVG />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl w-full mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-10">Why Choose ProgTrack?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 transition">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-4xl w-full mt-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="bg-indigo-50 dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center text-center border border-indigo-100 dark:border-gray-700 transition">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg mb-3">{i + 1}</div>
              <h4 className="text-base font-semibold text-indigo-700 dark:text-indigo-300 mb-1">{s.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 text-gray-400 dark:text-gray-600 text-sm text-center w-full border-t border-gray-100 dark:border-gray-800 pt-8">&copy; {new Date().getFullYear()} ProgTrack. All rights reserved.</div>
    </div>
  );
};

export default Home; 
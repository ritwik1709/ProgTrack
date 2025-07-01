import React, { useState } from 'react';
import axios from '../axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/register', { username, email, password });
      toast.success('Registered successfully! Please login.');
      if (onRegister) onRegister();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-20 px-4 transition-colors duration-200">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10 max-w-md w-full flex flex-col items-center transition-colors duration-200">
        <div className="mb-6 flex flex-col items-center">
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#6366F1"/><path d="M7 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/></svg>
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-200 mt-4 mb-1">Create your account</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Sign up to get started with ProjManager.</p>
        </div>
        <div className="w-full mb-4">
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full text-base py-2 px-3 focus:border-indigo-500 focus:outline-none" placeholder="Your name" required />
        </div>
        <div className="w-full mb-4">
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full text-base py-2 px-3 focus:border-indigo-500 focus:outline-none" placeholder="you@example.com" required />
        </div>
        <div className="w-full mb-6">
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md w-full text-base py-2 px-3 focus:border-indigo-500 focus:outline-none" placeholder="••••••••" required />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg w-full text-lg font-semibold shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition mb-3" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        <div className="text-sm text-gray-500 dark:text-gray-300 mt-2">Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Login</Link></div>
      </form>
    </div>
  );
};

export default Register; 
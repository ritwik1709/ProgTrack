import React, { useEffect, useState } from 'react';
import axios from '../axios';
import AddProjectModal from './AddProjectModal';
import { useNavigate } from 'react-router-dom';

const Projects = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = () => {
    axios.get('http://localhost:9000/projects/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setProjects(res.data))
      .catch(() => setProjects([]));
  };

  useEffect(() => {
    fetchProjects();
    const updateListener = () => fetchProjects();
    document.addEventListener('projectUpdate', updateListener);
    return () => document.removeEventListener('projectUpdate', updateListener);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 min-h-[80vh] bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Projects</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
        >
          + New Project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-16">No projects yet. Click "New Project" to get started!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6 cursor-pointer hover:shadow-lg border border-gray-100 dark:border-gray-800 transition flex flex-col"
              onClick={() => navigate(`/${project._id}`)}
            >
              <h3 className="text-base sm:text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-1 sm:mb-2 truncate">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2">{project.description}</p>
              <span className="text-xs sm:text-xs text-gray-400 dark:text-gray-500 mt-auto">Last updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</span>
            </div>
          ))}
        </div>
      )}
      <AddProjectModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default Projects; 
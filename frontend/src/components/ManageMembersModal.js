import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { toast } from 'react-hot-toast';

const roles = ['Owner', 'Member', 'Viewer'];

const ManageMembersModal = ({ projectId, isOpen, onClose, currentUserId }) => {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = () => {
    axios.get(`/project/${projectId}/members`)
      .then(res => setMembers(res.data))
      .catch(() => setMembers([]));
  };

  useEffect(() => {
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const isOwner = members.some(m => m.user._id === currentUserId && m.role === 'Owner');

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`/project/${projectId}/members`, { email, role });
      setEmail(''); setRole('Member');
      fetchMembers();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('You do not have permission to add members.');
        toast.error('You do not have permission to add members.');
      } else {
        setError(err.response?.data?.message || 'Error inviting member');
        toast.error(err.response?.data?.message || 'Error inviting member');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true); setError('');
    try {
      await axios.put(`/project/${projectId}/members/${userId}`, { role: newRole });
      fetchMembers();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('You do not have permission to change roles.');
        toast.error('You do not have permission to change roles.');
      } else {
        setError(err.response?.data?.message || 'Error changing role');
        toast.error(err.response?.data?.message || 'Error changing role');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    setLoading(true); setError('');
    try {
      await axios.delete(`/project/${projectId}/members/${userId}`);
      fetchMembers();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('You do not have permission to remove members.');
        toast.error('You do not have permission to remove members.');
      } else {
        setError(err.response?.data?.message || 'Error removing member');
        toast.error(err.response?.data?.message || 'Error removing member');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&times;</button>
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Manage Members</h2>
        {isOwner && (
          <form onSubmit={handleInvite} className="mb-4 flex flex-col gap-2">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Invite by email" className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" required />
            <select value={role} onChange={e => setRole(e.target.value)} className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button type="submit" className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 disabled:opacity-60" disabled={loading}>{loading ? 'Inviting...' : 'Invite'}</button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </form>
        )}
        <div className="mb-2 text-gray-700 dark:text-gray-200 font-semibold">Members</div>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {members.map(m => (
            <li key={m.user._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-3 py-2">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{m.user.username || m.user.email}</div>
                <div className="text-xs text-gray-500">{m.user.email}</div>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && m.user._id !== currentUserId ? (
                  <>
                    <select value={m.role} onChange={e => handleRoleChange(m.user._id, e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button onClick={() => handleRemove(m.user._id)} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                  </>
                ) : (
                  <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{m.role}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageMembersModal; 
import AppLayout from "./components/AppLayout";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Task from "./components/Task";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Register from "./components/Register";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Projects from "./components/Projects";

function App() {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) return JSON.parse(storedUser);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const u = { username: payload.username, email: payload.email, id: payload.id };
        localStorage.setItem('user', JSON.stringify(u));
        return u;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/');
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const handleRegister = () => {
    navigate('/login');
  };

  const handleToggleDark = () => setDarkMode(dm => !dm);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <AppLayout user={user} onLogout={handleLogout} darkMode={darkMode} onToggleDark={handleToggleDark}>
        <Toaster position="top-right" gutter={8} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/projects" element={user ? <Projects user={user} /> : <Navigate to="/login" replace />} />
          <Route path=":projectId" element={user ? <Task /> : <Navigate to="/login" replace />} />
          {/* Fallback: if not found, go to home */}
          <Route path="*" element={<Home user={user} />} />
        </Routes>
      </AppLayout>
    </div>
  );
}

export default App;

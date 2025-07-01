import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout, onToggleDark, darkMode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Accessibility: close on Esc, focus trap, close on backdrop click
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll('a,button');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus first link
    setTimeout(() => { firstLinkRef.current?.focus(); }, 0);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const navLinks = user ? (
    <>
      <Link to='/projects' onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded transition-colors text-base font-semibold ${location.pathname === '/projects' ? (darkMode ? 'text-indigo-300' : 'text-indigo-700 underline') : (darkMode ? 'text-gray-100 hover:text-indigo-300' : 'text-gray-700 hover:text-indigo-700')}`}>Projects</Link>
      <button onClick={() => { setMenuOpen(false); onLogout(); }} className={`block px-4 py-2 rounded transition-colors text-base font-semibold w-full text-left ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>Logout</button>
    </>
  ) : (
    <>
      <Link to='/login' onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded transition-colors text-base font-semibold ${darkMode ? 'text-gray-100 hover:text-indigo-300' : 'text-gray-700 hover:text-indigo-700'}`}>Login</Link>
      <Link to='/register' onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded transition-colors text-base font-semibold ${darkMode ? 'text-gray-100 hover:text-indigo-300' : 'text-gray-700 hover:text-indigo-700'}`}>Register</Link>
    </>
  );

  return (
    <nav className={`h-14 flex items-center justify-between px-4 sm:px-8 w-full shadow transition-colors duration-200 z-20 ${darkMode ? 'bg-gray-800 border-b border-gray-700 shadow-lg' : 'bg-white'}`}>
      <Link to='/' className='flex items-center space-x-2 group'>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-indigo-600 group-hover:scale-110 transition-transform"><rect width="24" height="24" rx="6" fill={darkMode ? '#6366F1' : '#EEF2FF'}/><path d="M7 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" stroke={darkMode ? '#fff' : '#6366F1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke={darkMode ? '#fff' : '#6366F1'} strokeWidth="2"/></svg>
        <span className={`font-extrabold text-lg sm:text-xl tracking-tight ${darkMode ? 'text-white' : 'text-indigo-700'} transition-colors`}>ProgTrack</span>
      </Link>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <Link to='/projects' className={`text-base font-semibold px-2 py-1 rounded transition-colors ${location.pathname === '/projects' ? (darkMode ? 'text-indigo-300' : 'text-indigo-700 underline') : (darkMode ? 'text-gray-100 hover:text-indigo-300' : 'text-gray-700 hover:text-indigo-700')}`}>Projects</Link>
            <button onClick={onLogout} className={`text-base font-semibold px-2 py-1 rounded transition-colors ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login' className={`text-base font-semibold px-2 py-1 rounded transition-colors ${darkMode ? 'text-gray-100 hover:text-indigo-300' : 'text-gray-700 hover:text-indigo-700'}`}>Login</Link>
            <Link to='/register' className={`text-base font-semibold px-2 py-1 rounded transition-colors ${darkMode ? 'text-gray-100 hover:text-indigo-300' : 'text-gray-700 hover:text-indigo-700'}`}>Register</Link>
          </>
        )}
        <button onClick={onToggleDark} className={`ml-4 p-2 rounded-full border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'}`} title="Toggle dark mode">
          {darkMode ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/></svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/></svg>
          )}
        </button>
      </div>
      {/* Mobile nav */}
      <div className="flex md:hidden items-center">
        <button onClick={onToggleDark} className={`mr-2 p-2 rounded-full border transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'}`} title="Toggle dark mode">
          {darkMode ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/></svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/></svg>
          )}
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2 rounded-md focus:outline-none ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} aria-label="Open menu">
          {menuOpen ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </button>
        {/* Dropdown menu with backdrop and animation */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-20 bg-black bg-opacity-30 transition-opacity animate-fadeIn"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Dropdown */}
            <div
              ref={menuRef}
              className={`fixed top-14 right-4 w-48 rounded-lg shadow-lg z-30 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} animate-slideDown`}
              tabIndex={-1}
            >
              <div className="flex flex-col py-2">
                {React.Children.map(navLinks.props.children, (child, idx) =>
                  idx === 0
                    ? React.cloneElement(child, { ref: firstLinkRef })
                    : child
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
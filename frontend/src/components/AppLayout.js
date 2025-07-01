import React from 'react'
import Navbar from './Navbar'

const AppLayout = ({ children, user, onLogout, darkMode, onToggleDark }) => {
    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200">
            <Navbar user={user} onLogout={onLogout} darkMode={darkMode} onToggleDark={onToggleDark} />
            <main className='flex-1 flex flex-col items-center justify-center w-full'>
                {children}
            </main>
        </div>
    )
}

export default AppLayout
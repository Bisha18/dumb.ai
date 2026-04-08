import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, FileText, Network, Sparkles, Search as SearchIcon } from 'lucide-react';
import SearchModal from './SearchModal';

const Layout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neo-white relative">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Sidebar for Desktop/Tablet */}
      <aside className="hidden md:flex flex-col w-64 border-r-brutal border-neo-black bg-neo-yellow min-h-screen">
        <div className="p-6 border-b-brutal border-neo-black bg-neo-white">
          <h1 className="text-2xl font-black uppercase tracking-tight">Dumb.ai</h1>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between p-3 bg-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-transform font-bold text-lg cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <SearchIcon className="w-5 h-5 text-neo-black" />
              <span>Search</span>
            </div>
            <span className="text-xs bg-gray-200 px-2 py-1 border border-black rounded-md">Ctrl K</span>
          </button>
          
          <Link to="/dashboard" className="flex items-center space-x-3 p-3 bg-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-transform font-bold text-lg">
            <Home className="w-6 h-6" />
            <span>Dashboard</span>
          </Link>
          <Link to="/notes" className="flex items-center space-x-3 p-3 bg-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-transform font-bold text-lg">
            <FileText className="w-6 h-6" />
            <span>Notes</span>
          </Link>
          <Link to="/graph" className="flex items-center space-x-3 p-3 bg-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-transform font-bold text-lg">
            <Network className="w-6 h-6" />
            <span>Graph</span>
          </Link>
          <Link to="/ai" className="flex items-center space-x-3 p-3 bg-neo-blue text-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-transform font-bold text-lg">
            <Sparkles className="w-6 h-6" />
            <span>AI Insights</span>
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t-brutal border-neo-black">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/landing';
            }}
            className="w-full p-3 font-bold text-white bg-neo-black border-brutal shadow-brutal hover:bg-neo-red hover:-translate-y-1 transition-all cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t-brutal-lg border-neo-black flex justify-around p-3 z-50">
        <Link to="/dashboard" className="p-2"><Home className="w-8 h-8" /></Link>
        <button onClick={() => setIsSearchOpen(true)} className="p-2"><SearchIcon className="w-8 h-8" /></button>
        <Link to="/notes" className="p-2"><FileText className="w-8 h-8" /></Link>
        <Link to="/graph" className="p-2"><Network className="w-8 h-8" /></Link>
        <Link to="/ai" className="p-2 bg-neo-yellow border-brutal"><Sparkles className="w-8 h-8" /></Link>
      </nav>
    </div>
  );
};

export default Layout;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useStore from '../store/useStore';
import { Pin, PinOff } from 'lucide-react';

const Dashboard = () => {
  const notes = useStore(state => state.notes);
  const setNotes = useStore(state => state.setNotes);
  const user = useStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes');
        setNotes(res.data);
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [setNotes]);

  const togglePin = async (e, note) => {
    e.stopPropagation();
    try {
      const res = await api.put(`/notes/${note._id}`, { isPinned: !note.isPinned });
      // The websocket context will handle updating the state globally,
      // but we can optionally do it locally too for immediate feedback.
    } catch (err) {
      console.error(err);
    }
  };

  // Sort notes: Pinnned first, then by date descending (already sorted by backend mostly)
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    return a.isPinned ? -1 : 1;
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="text-4xl font-black uppercase tracking-tight">Dashboard</h2>
        <button 
          onClick={() => navigate('/notes')}
          className="bg-neo-blue text-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-transform px-6 py-3 font-bold text-lg uppercase cursor-pointer"
        >
          + New Note
        </button>
      </header>

      {loading ? (
        <div className="text-xl font-bold">Loading your brain...</div>
      ) : sortedNotes.length === 0 ? (
        <div className="bg-neo-yellow border-brutal-lg shadow-brutal p-8 text-center">
          <h3 className="text-2xl font-black mb-2">No notes yet!</h3>
          <p className="font-medium text-lg">Start connecting your ideas by creating your first note.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map((note) => (
            <div 
              key={note._id} 
              onClick={() => navigate('/notes', { state: { selectedNoteId: note._id } })}
              className={`bg-white border-brutal-lg shadow-brutal p-6 relative group transform hover:-translate-y-1 transition-all cursor-pointer ${note.isPinned ? 'border-neo-blue' : ''}`}
            >
              <div className="flex justify-between items-start mb-3 border-b-brutal pb-2 border-neo-black">
                <h3 className="text-xl font-bold truncate pr-4">
                  {note.title || 'Untitled'}
                </h3>
                <button 
                  onClick={(e) => togglePin(e, note)} 
                  className="bg-transparent hover:bg-gray-200 p-1 rounded-sm"
                >
                  {note.isPinned ? <Pin className="w-5 h-5 text-neo-blue fill-neo-blue" /> : <PinOff className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              <p className="text-gray-700 font-medium line-clamp-3">
                {note.content || 'Empty note...'}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {note.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs font-bold bg-neo-yellow text-neo-black px-2 py-1 border-2 border-neo-black">
                    {tag}
                  </span>
                ))}
                {note.links && note.links.length > 0 && (
                  <span className="text-xs font-bold bg-neo-black text-white px-2 py-1 border-2 border-neo-black ml-auto">
                    {note.links.length} Links
                  </span>
                )}
              </div>

              <div className={`absolute -top-3 -right-3 border-brutal px-2 py-1 font-bold text-sm transform rotate-12 ${note.isPinned ? 'bg-neo-blue text-white' : 'bg-neo-white text-neo-black'}`}>
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, X } from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchNotes = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/notes/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(searchNotes, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white border-brutal-lg shadow-brutal flex flex-col relative">
        <button onClick={onClose} className="absolute -top-6 -right-6 bg-neo-yellow border-brutal p-2 hover:bg-neo-red hover:text-white transition-colors cursor-pointer z-10 hidden sm:block">
          <X className="w-6 h-6" />
        </button>
        
        <div className="bg-neo-blue border-b-brutal flex items-center p-4 gap-4">
          <Search className="w-8 h-8 text-white" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-white font-black text-3xl outline-none placeholder-white/60"
            placeholder="Search notes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 bg-neo-white flex flex-col gap-3 min-h-[300px]">
          {loading && <p className="font-bold text-center py-4">Searching your brain...</p>}
          {!loading && query && results.length === 0 && <p className="font-bold text-center py-4">No results found.</p>}
          {!loading && !query && <p className="font-bold text-center py-4 text-gray-500">Type something to trigger global search.</p>}
          
          {results.map((note) => (
            <div 
              key={note._id}
              onClick={() => {
                onClose();
                navigate('/notes', { state: { selectedNoteId: note._id } });
              }}
              className="bg-white border-brutal shadow-brutal-sm p-4 hover:-translate-y-1 hover:shadow-brutal cursor-pointer transition-all flex flex-col"
            >
              <h4 className="font-black text-lg">{note.title || 'Untitled'}</h4>
              <p className="text-sm font-medium text-gray-600 line-clamp-2 mt-1">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

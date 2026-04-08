import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useStore from '../store/useStore';
import { Tag, Save, Plus, ArrowUpRight } from 'lucide-react';

const NoteEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notes = useStore(state => state.notes);
  const setNotes = useStore(state => state.setNotes);
  
  const [activeNoteId, setActiveNoteId] = useState(location.state?.selectedNoteId || null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);

  const [saving, setSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [backlinks, setBacklinks] = useState([]);

  // Auto-save debounce timer
  const debounceTimer = useRef(null);
  // Auto-save tracker to prevent infinite loops
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes');
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [setNotes]);

  useEffect(() => {
    if (activeNoteId) {
      isInitialLoad.current = true;
      const note = notes.find(n => n._id === activeNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags || []);
        setLinks(note.links || []);
        setAiSuggestions([]);
        fetchBacklinks(activeNoteId);
      }
      setTimeout(() => { isInitialLoad.current = false; }, 500);
    } else {
      isInitialLoad.current = true;
      setTitle('');
      setContent('');
      setTags([]);
      setLinks([]);
      setAiSuggestions([]);
      setBacklinks([]);
      setTimeout(() => { isInitialLoad.current = false; }, 500);
    }
  }, [activeNoteId, notes]);

  // Auto-save effect
  useEffect(() => {
    if (isInitialLoad.current) return;
    
    if (activeNoteId && (title || content)) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      
      setSaving(true);
      debounceTimer.current = setTimeout(async () => {
        try {
          await api.put(`/notes/${activeNoteId}`, { title, content, tags, links });
        } catch (error) {
          console.error('Auto-save failed', error);
        } finally {
          setSaving(false);
        }
      }, 1500); // 1.5 second debounce Auto-save
    }
  }, [title, content, tags, links]);

  const fetchBacklinks = async (id) => {
    try {
      const res = await api.get(`/notes/${id}/backlinks`);
      setBacklinks(res.data);
    } catch (err) {
      console.error('Failed to fetch backlinks', err);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      if (!activeNoteId) {
        const res = await api.post('/notes', { title, content, tags, links });
        setActiveNoteId(res.data._id);
        const refetch = await api.get('/notes');
        setNotes(refetch.data);
      } else {
        await api.put(`/notes/${activeNoteId}`, { title, content, tags, links });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const startNewNote = () => {
    setActiveNoteId(null);
  };

  const getAiSuggestions = async () => {
    if (!content) return;
    setLoadingAi(true);
    try {
      const res = await api.post('/ai/suggest-links', { content, tags: tags.join(',') });
      setAiSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const applyAiTag = (tag) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setAiSuggestions(aiSuggestions.filter(t => t !== tag));
  };

  return (
    <div className="flex gap-6 h-[85vh] -m-4 md:-m-0 box-border">
      <div className="hidden lg:flex flex-col w-64 bg-white border-brutal shadow-brutal overflow-hidden">
        <div className="p-4 bg-neo-yellow border-b-brutal flex justify-between items-center">
          <h3 className="font-black text-xl">All Notes</h3>
          <button onClick={startNewNote} className="bg-neo-blue text-white p-1 border-2 border-neo-black hover:bg-neo-red cursor-pointer transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto w-full">
          {notes.map(note => (
            <div 
              key={note._id} 
              onClick={() => setActiveNoteId(note._id)}
              className={`p-4 border-b-2 border-gray-200 cursor-pointer transition-colors hover:bg-gray-100 ${activeNoteId === note._id ? 'bg-neo-blue text-white hover:bg-neo-blue' : ''}`}
            >
              <h4 className="font-bold truncate">{note.title || 'Untitled'}</h4>
              <p className={`text-sm truncate ${activeNoteId === note._id ? 'text-gray-200' : 'text-gray-500'}`}>{note.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white border-brutal flex flex-col relative w-full h-full shadow-brutal">
        <div className="h-16 border-b-brutal bg-neo-white flex items-center justify-between px-4 shrink-0">
          <input
            type="text"
            className="bg-transparent font-black text-2xl outline-none placeholder-neo-black placeholder-opacity-50 w-full"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <textarea
          className="flex-1 p-6 text-lg font-medium outline-none resize-none bg-white"
          placeholder="Start typing your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="border-t-brutal p-4 bg-neo-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <Tag className="w-5 h-5 justify-center flex-shrink-0 text-neo-black" />
            {tags.map(tag => (
              <span key={tag} className="bg-neo-yellow text-neo-black px-2 py-1 font-bold text-sm border-2 border-neo-black hover:bg-neo-red hover:text-white cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} &times;
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag + Enter"
              className="outline-none font-bold placeholder-gray-500 bg-transparent border-b-2 border-dashed border-gray-400 focus:border-neo-black min-w-[120px]"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
            />
            
            <span className="w-px h-6 bg-neo-black mx-2 max-sm:hidden"></span>
            
            <select 
              className="bg-white border-2 border-neo-black p-1 font-bold outline-none cursor-pointer text-sm"
              onChange={(e) => {
                if (e.target.value && !links.includes(e.target.value)) {
                  setLinks([...links, e.target.value]);
                }
                e.target.value = ""; // reset
              }}
            >
              <option value="">🔗 Connect related note...</option>
              {notes.filter(n => n._id !== activeNoteId && !links.includes(n._id)).map(n => (
                <option key={n._id} value={n._id}>{n.title || 'Untitled'}</option>
              ))}
            </select>
            
            {links.map(linkId => {
              const linkedNote = notes.find(n => n._id === linkId);
              return (
                <span key={linkId} onClick={() => setLinks(links.filter(l => l !== linkId))} className="bg-neo-blue text-white px-2 py-1 font-bold text-xs border-2 border-neo-black hover:bg-neo-red cursor-pointer">
                  🔗 {linkedNote ? linkedNote.title : 'Unknown'} &times;
                </span>
              );
            })}
          </div>
          
          <button 
            onClick={handleManualSave}
            disabled={saving}
            className="flex-shrink-0 bg-neo-black text-white px-6 py-2 font-bold text-lg border-brutal shadow-brutal hover:-translate-y-[2px] transition-transform cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Auto-saving...' : (activeNoteId ? 'Update' : 'Save')}
          </button>
        </div>
      </div>

      <div className="hidden xl:flex w-80 flex-col gap-6 overflow-y-auto">
        {/* Backlinks Panel */}
        <div className="bg-white border-brutal shadow-brutal p-5 shrink-0">
          <h3 className="font-black text-xl border-b-brutal pb-2 mb-4 bg-neo-black text-white px-3 py-1 inline-block shadow-brutal-sm">
            Backlinks
          </h3>
          {backlinks.length === 0 ? (
            <p className="text-sm font-medium text-gray-500 italic">No notes link to this one yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {backlinks.map(bl => (
                <div 
                  key={bl._id} 
                  onClick={() => setActiveNoteId(bl._id)}
                  className="bg-neo-white border-brutal p-3 cursor-pointer hover:bg-neo-yellow transition-colors relative group"
                >
                  <h4 className="font-bold flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> {bl.title}</h4>
                  <p className="text-xs text-gray-600 truncate mt-1">{bl.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Magic Panel */}
        <div className="bg-white border-brutal shadow-brutal p-5 shrink-0">
          <h3 className="font-black text-xl border-b-brutal pb-2 mb-4 bg-neo-red text-white px-3 py-1 inline-block transform -rotate-2 shadow-brutal-sm">
            AI Magic
          </h3>
          <p className="text-sm font-medium mb-4 text-gray-700">Get context-aware topic suggestions using Gemini.</p>
          <button 
            onClick={getAiSuggestions}
            disabled={loadingAi || content.length < 5}
            className="w-full bg-neo-blue text-white border-brutal py-2 font-bold shadow-brutal hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50 cursor-pointer mb-6"
          >
            {loadingAi ? 'Thinking...' : 'Generate Connections'}
          </button>

          {aiSuggestions.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">Suggestions:</span>
              {aiSuggestions.map(sug => (
                <button 
                  key={sug} 
                  onClick={() => applyAiTag(sug)}
                  className="bg-white border-brutal shadow-brutal-sm px-3 py-2 text-left font-bold cursor-pointer hover:bg-neo-yellow transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;

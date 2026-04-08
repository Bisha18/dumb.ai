import { useEffect } from 'react';
import { socket } from '../services/socket';
import useStore from '../store/useStore';

export const useSocketInit = () => {
  const notes = useStore(state => state.notes);
  const setNotes = useStore(state => state.setNotes);

  useEffect(() => {
    const handleNoteUpdated = (updatedNote) => {
      setNotes((prevNotes) => {
        const exists = prevNotes.find(n => n._id === updatedNote._id);
        if (exists) {
          // Replace existing note
          return prevNotes.map(n => n._id === updatedNote._id ? updatedNote : n);
        } else {
          // Append new note to the top
          return [updatedNote, ...prevNotes];
        }
      });
    };

    socket.on('note:updated', handleNoteUpdated);

    return () => {
      socket.off('note:updated', handleNoteUpdated);
    };
  }, [setNotes]);
};

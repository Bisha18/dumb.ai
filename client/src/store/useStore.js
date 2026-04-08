import { create } from 'zustand';

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  notes: [],
  isLoading: false,
  setUser: (user, token) => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    set({ user, token });
  },
  setNotes: (notesOrUpdater) => set((state) => ({ 
    notes: typeof notesOrUpdater === 'function' ? notesOrUpdater(state.notes) : notesOrUpdater 
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useStore;

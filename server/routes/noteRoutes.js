const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

// Get all notes for user
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search notes
router.get('/search', protect, async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  try {
    const notes = await Note.find({
      userId: req.user._id,
      $text: { $search: q }
    }).sort({ score: { $meta: 'textScore' } });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get note by id
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id }).populate('links');
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get backlinks
router.get('/:id/backlinks', protect, async (req, res) => {
  try {
    const backlinks = await Note.find({ links: req.params.id, userId: req.user._id });
    res.json(backlinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create note
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, tags, links, isPinned } = req.body;
    const note = await Note.create({
      title: title || 'Untitled Note',
      content: content || '',
      tags: tags || [],
      links: links || [],
      isPinned: isPinned || false,
      userId: req.user._id
    });
    req.app.get('io').emit('note:updated', note); // Emit for realtime updates
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update note
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, tags, links, isPinned } = req.body;
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (note) {
      note.title = title !== undefined ? title : note.title;
      note.content = content !== undefined ? content : note.content;
      note.tags = tags !== undefined ? tags : note.tags;
      note.links = links !== undefined ? links : note.links;
      note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;
      
      const updatedNote = await note.save();
      req.app.get('io').emit('note:updated', updatedNote); // Emit for realtime updates
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete note
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (note) {
      res.json({ message: 'Note removed' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

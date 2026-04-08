const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    
    const nodes = notes.map(note => ({
      id: note._id.toString(),
      data: { label: note.title, tags: note.tags },
      position: { x: Math.random() * 500, y: Math.random() * 500 }, // Initial random position for React Flow
    }));

    const edges = [];
    notes.forEach(note => {
      note.links.forEach(linkId => {
        edges.push({
          id: `e${note._id}-${linkId}`,
          source: note._id.toString(),
          target: linkId.toString(),
          animated: true,
        });
      });
    });

    res.json({ nodes, edges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

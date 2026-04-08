const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const geminiService = require('../services/geminiService');

router.post('/summarize', protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const summary = await geminiService.summarizeNote(content);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/suggest-links', protect, async (req, res) => {
  try {
    const { content, tags } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const suggestions = await geminiService.suggestLinks(content, tags || []);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

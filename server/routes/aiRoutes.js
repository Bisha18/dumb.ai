const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const geminiService = require('../services/geminiService');

router.post('/summarize', protect, async (req, res) => {
  try {
    console.log('[AI /summarize] Request received, content length:', req.body.content?.length);
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const summary = await geminiService.summarizeNote(content);
    console.log('[AI /summarize] Success, summary length:', summary?.length);
    res.json({ summary });
  } catch (error) {
    console.error('[AI /summarize] ERROR:', error.message);
    console.error('[AI /summarize] Full error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/suggest-links', protect, async (req, res) => {
  try {
    console.log('[AI /suggest-links] Request received');
    const { content, tags } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const suggestions = await geminiService.suggestLinks(content, tags || []);
    console.log('[AI /suggest-links] Success:', suggestions);
    res.json({ suggestions });
  } catch (error) {
    console.error('[AI /suggest-links] ERROR:', error.message);
    console.error('[AI /suggest-links] Full error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

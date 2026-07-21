const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbotController');
const { ensureAuth } = require('../middleware/authMiddleware');

// @desc    Handle Chatbot POST requests
// @route   POST /api/chatbot
router.post('/api/chatbot', handleChat);

module.exports = router;
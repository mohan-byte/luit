// routes/users.js
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// @desc    Render Member Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, userController.renderMemberDashboard);

module.exports = router;
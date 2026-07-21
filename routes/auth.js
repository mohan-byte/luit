const express = require('express');
const router = express.Router();

// Import the correct, final controller functions
const {
    renderRegisterPage,
    registerUser,
    renderLoginPage,
    loginUser,
    logoutUser,
    renderCompleteRegistrationPage,
    handleCompleteRegistration
} = require('../controllers/authController');


// --- Registration Routes ---
router.get('/register', renderRegisterPage);
router.post('/register', registerUser);

// --- Login / Logout Routes ---
router.get('/login', renderLoginPage);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// --- Complete Registration Routes (from email link) ---
router.get('/complete-registration/:token', renderCompleteRegistrationPage);
router.post('/complete-registration/:token', handleCompleteRegistration);


module.exports = router;
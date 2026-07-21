const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // <-- ADD THIS LINE
const applyController = require('../controllers/applyController');
const { ensureAuth } = require('../middleware/authMiddleware');

// Configure Multer for document storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/uploads/documents'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
// --- File Filter for Security ---
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|pdf/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Accept the file
    } else {
        cb(new Error('Error: Only images (jpeg, jpg, png) and PDF files are allowed!'), false); // Reject the file
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 1024 * 500 // 500 KB file size limit
    }
});

// Routes to render the application forms (now public)
router.get('/:plan', applyController.renderApplicationForm);

// Route to handle the form submission with all new fields
router.post('/:plan/submit', upload.fields([
    { name: 'aadhaarCard', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'passbook', maxCount: 1 },
    { name: 'voterCard', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'nomineeProof', maxCount: 1 }
]), applyController.submitApplication);

module.exports = router;
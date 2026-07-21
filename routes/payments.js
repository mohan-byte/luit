const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// @desc    Render the Renewal Premium page
// @route   GET /payments/renewal
router.get('/renewal', paymentsController.renderRenewalPage);

// @desc    Render the Loan EMI Pay page
// @route   GET /payments/loan-emi
router.get('/loan-emi', paymentsController.renderLoanEmiPage);

// @desc    Render the View/Download Receipts page
// @route   GET /payments/receipts
router.get('/receipts', paymentsController.renderReceiptsPage);

// @desc    Generate a new CAPTCHA
// @route   GET /payments/captcha
router.get('/captcha', paymentsController.generateCaptcha);

// @desc    Handle form submissions (we'll use one handler for demo)
// @route   POST /payments/submit
router.post('/submit', paymentsController.handleSubmit);

module.exports = router;
// routes/index.js
const express = require('express');
const router = express.Router();
const { 
    renderHomePage, 
    renderAboutPage,
    renderLoansPage,
    renderServicesPage,
    renderContactPage,
    renderEmiCalculatorPage,
    renderDepositCalculatorPage,
    renderCareersPage,
    renderPayPremiumPage
} = require('../controllers/indexController');

// @desc    Render Home Page
// @route   GET /
router.get('/', renderHomePage);
router.get('/about', renderAboutPage);
router.get('/loans', renderLoansPage);
router.get('/services', renderServicesPage);
router.get('/contact', renderContactPage);
router.get('/loan-emi-calculator', renderEmiCalculatorPage);
router.get('/deposit-maturity-calculator', renderDepositCalculatorPage);
router.get('/careers', renderCareersPage);
router.get('/premium', renderPayPremiumPage);

module.exports = router;
// controllers/indexController.js
// Render Home Page
exports.renderHomePage = (req, res) => {
    res.render('home', { title: 'LuitPrise' });
};

// Render About Us Page
exports.renderAboutPage = (req, res) => {
    res.render('about', { title: 'About Us' });
};

// Render Services Page
exports.renderServicesPage = (req, res) => {
    res.render('services', { title: 'Our Services' });
};

// Render Services Page
exports.renderLoansPage = (req, res) => {
    res.render('loans', { title: 'Our Loans' });
};

// Render Loan EMI Calculator Page
exports.renderEmiCalculatorPage = (req, res) => {
    res.render('loan-emi-calculator', { title: 'Loan EMI Calculator' });
};

// Render Deposit Maturity Calculator Page
exports.renderDepositCalculatorPage = (req, res) => {
    res.render('deposit-maturity-calculator', { title: 'Deposit Maturity Calculator' });
};

// Render Contact Us Page
exports.renderContactPage = (req, res) => {
    res.render('contact', { title: 'Contact Us' });
};

// Render Careers Page
exports.renderCareersPage = (req, res) => {
    res.render('careers', { 
        title: 'Careers',
        // Read the URL from the .env file and pass it to the view
        formUrl: process.env.GOOGLE_FORM_URL 
    });
};

// Render Pay Premium Page
exports.renderPayPremiumPage = (req, res) => {
    res.render('pay-premium', { title: 'Pay Premium' });
};
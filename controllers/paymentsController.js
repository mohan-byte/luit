const svgCaptcha = require('svg-captcha');

// Generate a new CAPTCHA and store it in the session
exports.generateCaptcha = (req, res) => {
    const captcha = svgCaptcha.create({
        size: 6,
        ignoreChars: '0o1i',
        noise: 2,
        color: true,
        background: '#e9ecef'
    });
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
};

// Render the Renewal Premium page
exports.renderRenewalPage = (req, res) => {
    res.render('payments/renewal', { title: 'Renewal Premium' });
};

// Render the Loan EMI Pay page
exports.renderLoanEmiPage = (req, res) => {
    res.render('payments/loan-emi', { title: 'Pay Loan EMI' });
};

// Render the View/Download Receipts page
exports.renderReceiptsPage = (req, res) => {
    res.render('payments/receipts', { title: 'View/Download Receipt' });
};

// Handle a generic form submission
exports.handleSubmit = (req, res) => {
    const { captcha, ...formData } = req.body;
    const pageUrl = req.headers.referer || '/';

    // Validate CAPTCHA
    if (captcha && req.session.captcha && captcha.toLowerCase() === req.session.captcha.toLowerCase()) {
        // CAPTCHA is valid
        console.log('Form data submitted:', formData);
        // Here you would process the payment, find the receipt, etc.
        // For now, we'll just redirect with a success message.
        delete req.session.captcha; // Clear captcha after use
        res.redirect(`${pageUrl}?message=Success:%20Your%20request%20was%20submitted%20successfully!`);
    } else {
        // CAPTCHA is invalid
        res.redirect(`${pageUrl}?message=Error:%20Invalid%20CAPTCHA.%20Please%20try%20again.`);
    }
};
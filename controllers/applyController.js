const Application = require('../models/Application');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Renders the correct application form based on the plan type
exports.renderApplicationForm = (req, res) => {
    const planSlug = req.params.plan;
    const loanTypes = ['gold-loan', 'personal-loan'];
    const serviceTypes = ['fixed-deposit', 'recurring-deposit', 'child-savings-plan', 'retirement-savings'];

    const title = planSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Decide which template to render
    if (loanTypes.includes(planSlug)) {
        res.render('apply-loan', { 
            title: `Apply for ${title}`,
            planName: title,
            planSlug: planSlug
        });
    } else if (serviceTypes.includes(planSlug)) {
        res.render('apply-service', {
            title: `Apply for ${title}`,
            planName: title,
            planSlug: planSlug
        });
    } else {
        res.render('error', { message: 'Plan not found.' });
    }
};

// Handles the submission of any application
exports.submitApplication = async (req, res) => {
    try {
        const { planName, email, ...formData } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.render('error', { title: 'Error', message: 'An account with this email already exists.' });
        }

        // --- Create New User (without a password) ---
        const registrationToken = crypto.randomBytes(20).toString('hex');
        const newUser = new User({
    name: formData.firstName + ' ' + formData.lastName,
    email: email,
    phone: formData.mobile,
    registrationToken: registrationToken,
    // Set expiration for 1 hour from now
    registrationExpires: new Date(Date.now() + 3600000) 
});
await newUser.save({ validateBeforeSave: false });

        // --- Create New Application ---
        const documents = [];
        for (const key in req.files) {
            if (req.files[key]) {
                documents.push({ docName: key, docPath: req.files[key][0].path });
            }
        }
        
        const newApplication = new Application({
            applicant: newUser._id,
            planName: planName,
            formData: formData,
            documents: documents
        });
        await newApplication.save();

        // --- Send "Complete Registration" Email ---
        const registrationUrl = `http://localhost:3000/complete-registration/${registrationToken}`;
        const message = `
            <h1>Welcome to Luitprise Nidhi Ltd!</h1>
            <p>Your application for the ${planName} plan has been received. Your application number is <strong>${newApplication.applicationNumber}</strong>.</p>
            <p>To complete your registration and create a password for your account, please click the link below. This link is valid for one hour.</p>
            <a href="${registrationUrl}" style="background-color: #1A237E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Registration</a>
            <p>Thank you!</p>
        `;

        await sendEmail({
            // For testing, replace newUser.email with your actual Mailtrap account email
            email: "testm9741@gmail.com", 
            subject: 'Luitprise - Complete Your Registration',
            message: message
        });

        res.render('application-success', {
            title: 'Application Submitted',
            applicationNumber: newApplication.applicationNumber,
            planName: newApplication.planName,
            emailSent: true
        });

    } catch (error) {
        console.error(error);
        res.render('error', { title: 'Error', message: 'Something went wrong with your application.' });
    }
};
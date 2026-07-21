const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // 1. Create a transporter with credentials from .env
        const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER, // Will correctly read "api"
        pass: process.env.EMAIL_PASS  // Will correctly read your new API token
    }
});

        // 2. Define email options
        const mailOptions = {
            from: 'Luitprise Nidhi Ltd <hello@demomailtrap.co>',
            to: options.email,
            subject: options.subject,
            html: options.message
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');

    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
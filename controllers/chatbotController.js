// A simple server-side brain for the chatbot

exports.handleChat = (req, res) => {
    const { option } = req.body;
    let reply = "";

    // Use a switch statement to determine the response
    switch (option) {
        case 'deposit_info':
            reply = "Our Deposit Schemes include Fixed Deposits (FD) and Recurring Deposits (RD). They offer high-interest rates to help your savings grow securely.";
            break;
        case 'loan_info':
            reply = "We offer Gold Loans and Personal Loans with competitive interest rates and flexible repayment options. You can apply through your user dashboard.";
            break;
        case 'contact_help':
            reply = "You can contact our support team via email at support@luitprise.com or call us at +91 93711 60678 during business hours.";
            break;
        case 'forgot_password':
            reply = "To reset your password, please log out and use the 'Forgot Password' link on the login page. An email will be sent to you with instructions.";
            break;
        default:
            reply = "I'm sorry, I don't have information on that topic. Please select one of the available options.";
            break;
    }

    // Send the reply back as a JSON object
    res.json({ reply: reply });
};
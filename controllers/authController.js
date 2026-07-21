const User = require('../models/User');
const Application = require('../models/Application');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.renderRegisterPage = (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.registerUser = async (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword) {
        return res.render('register', { error: 'Please fill in all fields.' });
    }
    if (password !== confirmPassword) {
        return res.render('register', { error: 'Passwords do not match.' });
    }
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.render('register', { error: 'Email is already registered.' });
        }
        const user = await User.create({ name, email, phone, password });
        req.session.user = { id: user._id, name: user.name, role: user.role };
        res.redirect('/dashboard');
    } catch (error) {
        res.render('register', { error: 'Something went wrong.' });
    }
};

exports.renderLoginPage = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.loginUser = async (req, res) => {
    const { loginIdentifier, password } = req.body;
    if (!loginIdentifier || !password) {
        return res.render('login', { error: 'Please provide your credentials and password.' });
    }
    try {
        const user = await User.findOne({
            $or: [{ email: loginIdentifier }, { phone: loginIdentifier }]
        }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.render('login', { error: 'Invalid credentials.' });
        }

        req.session.user = { id: user._id, name: user.name, role: user.role };

        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else if (user.role === 'manager') {
            res.redirect('/manager/dashboard');
        } else {
            res.redirect('/dashboard');
        }
    } catch (error) {
        res.render('login', { error: 'Something went wrong.' });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

exports.renderCompleteRegistrationPage = async (req, res) => {
    try {
        const user = await User.findOne({
            registrationToken: req.params.token,
            registrationExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.render('error', { title: 'Error', message: 'Registration link is invalid or has expired.' });
        }
        res.render('set-password', { title: 'Complete Registration', token: req.params.token });
    } catch (error) {
        res.render('error', { title: 'Error', message: 'Something went wrong.' });
    }
};

exports.handleCompleteRegistration = async (req, res) => {
    try {
        const user = await User.findOne({
            registrationToken: req.params.token,
            registrationExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.render('error', { title: 'Error', message: 'Registration link is invalid or has expired.' });
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.render('set-password', { token: req.params.token, error: 'Passwords do not match.' });
        }

        user.password = req.body.password;
        user.registrationToken = undefined;
        user.registrationExpires = undefined;
        await user.save();
        
        req.session.user = { id: user._id, name: user.name, role: user.role };
        res.redirect('/dashboard');

    } catch (error) {
        res.render('error', { title: 'Error', message: 'Something went wrong.' });
    }
};
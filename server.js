// server.js
require('dotenv').config();
const express = require('express');
const path = 'path';
const hbs = require('express-hbs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Connect to Database ---
connectDB();

// --- View Engine Setup (Handlebars) ---
app.engine('hbs', hbs.express4({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- Session Configuration ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Set to false for security; only save sessions when modified
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

hbs.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { 
        return options.fn(this); 
    }
    return options.inverse(this);
});

// --- Global variables for views ---
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// --- Routes ---
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/users'));
app.use('/', require('./routes/chatbot'));
app.use('/payments', require('./routes/payments'));
app.use('/apply', require('./routes/apply'));
// We will add user and admin routes later

// --- Server Listening ---
app.listen(PORT, () => {
    console.log(`Server is running securely on http://localhost:${PORT}`);
});
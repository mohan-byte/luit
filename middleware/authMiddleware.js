// middleware/authMiddleware.js
module.exports = {
    // Protect routes, ensuring user is authenticated
    ensureAuth: function (req, res, next) {
        if (req.session.user) {
            return next(); // If user is in session, proceed
        } else {
            res.redirect('/login'); // If not, redirect to login
        }
    },
    // Ensure user is a guest (not logged in), for pages like Home, Login
    ensureGuest: function (req, res, next) {
        if (req.session.user) {
            res.redirect('/dashboard'); // If logged in, redirect to dashboard
        } else {
            return next();
        }
    }
};

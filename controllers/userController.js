const Application = require('../models/Application');

exports.renderMemberDashboard = async (req, res) => {
    try {
        // Add .lean() to the query
        const application = await Application.findOne({ applicant: req.session.user.id }).lean();

        if (!application) {
            return res.render('dashboard', { title: 'Dashboard', error: 'Could not find your application.' });
        }

        res.render('dashboard', {
            title: 'My Dashboard',
            user: req.session.user,
            application: application
        });
    } catch (error) {
        res.render('dashboard', { title: 'Dashboard', error: 'An error occurred.' });
    }
};
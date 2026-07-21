const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/luitpriseDB';
const managerEmail = 'manager@luitprise.com';
const managerPassword = '123456'; //bcrypt will hash this

const seedManager = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');

        const existingManager = await User.findOne({ email: managerEmail });
        if (existingManager) {
            console.log('Manager user already exists. Skipping seed.');
            mongoose.connection.close();
            return;
        }

        const managerUser = new User({
            name: 'Manager',
            email: managerEmail,
            phone: '1234567890',
            password: managerPassword, //bcrypt pre-save hook will hash this
            role: 'manager'
        });

        await managerUser.save();
        console.log('Manager user seeded successfully!');
        mongoose.connection.close();

    } catch (error) {
        console.error('Error seeding manager user:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedManager();
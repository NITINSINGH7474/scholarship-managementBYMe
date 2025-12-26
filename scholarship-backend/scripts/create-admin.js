const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123'; // Strong password in production!

        // Check if exists
        const existing = await User.findOne({ email: adminEmail });
        if (existing) {
            console.log('Admin user already exists.');
            existing.role = 'ADMIN';
            await existing.save();
            console.log('Updated existing user to ADMIN role.');
        } else {
            const admin = await User.create({
                email: adminEmail,
                password: adminPassword,
                role: 'ADMIN',
                emailVerified: true
            });
            console.log('Admin user created successfully.');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();

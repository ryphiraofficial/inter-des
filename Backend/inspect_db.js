import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/admin/User.js';

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // List all users
    const users = await User.find({});
    console.log('--- USERS ---');
    users.forEach(u => console.log(`${u._id}: ${u.fullName} <${u.email}> role=${u.role}`));

    // Reset password for siteengineer@gmail.com
    const se = await User.findOne({ email: 'siteengineer@gmail.com' });
    if (se) {
        se.password = 'password123';
        await se.save();
        console.log('Password for siteengineer@gmail.com updated to password123');
    } else {
        console.log('siteengineer@gmail.com not found');
    }
    
    await mongoose.disconnect();
}

run();

import mongoose from 'mongoose';
import User from './models/User.js';
import Staff from './models/Staff.js';
import dotenv from 'dotenv';
dotenv.config();

async function findNewStaff() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find users created in the last 30 minutes
        const halfHourAgo = new Date(Date.now() - 30 * 60 * 1000);
        const newUsers = await User.find({ createdAt: { $gte: halfHourAgo } });
        const newStaff = await Staff.find({ createdAt: { $gte: halfHourAgo } });

        console.log('\n--- New Users (Last 30m) ---');
        newUsers.forEach(u => console.log(`User: ${u.fullName} (${u.email}), Role: ${u.role}, StaffID: ${u.staffId}`));

        console.log('\n--- New Staff (Last 30m) ---');
        newStaff.forEach(s => console.log(`Staff: ${s.name} (${s.email}), Role: ${s.role}, StaffID: ${s.staffId}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findNewStaff();

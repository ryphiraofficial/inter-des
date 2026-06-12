import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Staff from '../models/admin/Staff.js';
import { calculateEmployeeAnalytics } from '../services/analytics/index.js';

dotenv.config();

const testEngine = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const allStaff = await Staff.find();
        console.log(`Found ${allStaff.length} staff members.\n`);

        for (const staff of allStaff) {
            console.log(`Evaluating staff: ${staff.name} (${staff.role})`);
            const result = await calculateEmployeeAnalytics(staff);
            console.log('Result Score:', result.score);
            console.log('Result Band:', result.band);
            console.log('Result Hike:', result.hike);
            console.log('Evidence:', JSON.stringify(result.evidence));
            console.log('Breakdown:', JSON.stringify(result.breakdown));
            console.log('----------------------------------------------------');
        }

        console.log('All evaluations finished.');
        process.exit(0);
    } catch (err) {
        console.error('Error running test:', err);
        process.exit(1);
    }
};

testEngine();

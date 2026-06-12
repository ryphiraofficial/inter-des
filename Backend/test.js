import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StaffReport from './src/models/admin/StaffReport.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

async function test() {
    const bundles = await StaffReport.find({ type: 'Weekly Bundle' }).sort({createdAt: -1}).limit(1);
    console.log(JSON.stringify(bundles, null, 2));
    process.exit(0);
}
test();

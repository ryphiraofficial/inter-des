import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const StaffReportSchema = new mongoose.Schema({
    createdAt: Date,
    reportDate: Date,
    title: String,
    forwardedToAdmin: Boolean
}, { collection: 'staffreports' });

const StaffReport = mongoose.model('StaffReportTemp', StaffReportSchema);

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const reports = await StaffReport.find({});
    console.log("ALL REPORTS IN DB:");
    reports.forEach(r => {
        console.log(`- ID: ${r._id}, Title: ${r.title}, createdAt: ${r.createdAt}, reportDate: ${r.reportDate}, forwardedToAdmin: ${r.forwardedToAdmin}`);
    });
    process.exit(0);
}
check();

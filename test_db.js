import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'Backend/.env') });

const StaffReportSchema = new mongoose.Schema({
    createdAt: Date,
    reportDate: Date,
    forwardedToAdmin: Boolean
}, { collection: 'staffreports' });

const StaffReport = mongoose.model('StaffReportTemp', StaffReportSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const reports = await StaffReport.find({});
    console.log(reports.map(r => ({
        id: r._id,
        createdAt: r.createdAt,
        reportDate: r.reportDate,
        forwardedToAdmin: r.forwardedToAdmin
    })));
    process.exit(0);
}
check();

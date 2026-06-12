import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StaffReport from './src/models/admin/StaffReport.js';
import Project from './src/models/design/Project.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

async function fix() {
    try {
        const bundle = await StaffReport.findById("6a2a613060e71c69ee7becbb");
        if (!bundle) return console.log("Bundle not found");

        for (let i = 0; i < bundle.dailyEntries.length; i++) {
            const entry = bundle.dailyEntries[i];
            const originalReport = await StaffReport.findById(entry.originalReportId).populate('project', 'name projectNumber');
            
            if (originalReport) {
                entry.type = originalReport.type;
                entry.priority = originalReport.priority;
                if (originalReport.project) {
                    entry.projectStr = `${originalReport.project.projectNumber} - ${originalReport.project.name}`;
                }
            }
        }
        await bundle.save();
        console.log("Bundle updated successfully!");
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
fix();

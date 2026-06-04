import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import ProductionTask from './models/ProductionTask.js';

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const tasks = await ProductionTask.find({});
    let count = 0;
    for (const t of tasks) {
        if (t.updates && t.updates.length > 0) {
            for (const u of t.updates) {
                if (u.images && u.images.length > 0) {
                    console.log(`Task: ${t.title}, Note: ${u.note}, Images:`, u.images);
                    count++;
                }
            }
        }
    }
    console.log(`Found ${count} updates with images`);
    process.exit(0);
});

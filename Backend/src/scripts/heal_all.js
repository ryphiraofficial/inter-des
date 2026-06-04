import mongoose from 'mongoose';
import Task from './models/Task.js';
import Project from './models/Project.js';
import Quotation from './models/Quotation.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('--- Database Repair & Healing Script ---');
    const tasks = await Task.find({});
    console.log(`Found ${tasks.length} total tasks.`);
    
    let healedCount = 0;
    for (const task of tasks) {
      if (task.project) {
        // Check if project reference points to a Quotation
        const isQuotation = await Quotation.findById(task.project);
        if (isQuotation) {
          console.log(`\nFound mismatch on task: "${task.title}" (ID: ${task._id})`);
          console.log(`Project field points to Quotation: "${isQuotation.projectName}" (ID: ${isQuotation._id})`);
          
          // Try to find the matching project
          const project = await Project.findOne({ quotation: isQuotation._id });
          if (project) {
            task.project = project._id;
            // Also ensure quotation is set on task if missing
            if (!task.quotation) {
              task.quotation = isQuotation._id;
            }
            await task.save();
            console.log(`✅ Healed! Assigned correct Project: "${project.name}" (ID: ${project._id})`);
            healedCount++;
          } else {
            console.log(`⚠️ Mismatch found, but no Project document exists for this quotation yet.`);
          }
        }
      }
    }
    
    console.log(`\nHealed ${healedCount} tasks total.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

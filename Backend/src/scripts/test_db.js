import mongoose from 'mongoose';
import Task from './models/Task.js';

mongoose.connect('mongodb://localhost:27017/interior_erp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const tasks = await Task.find();
    console.log(`Total tasks: ${tasks.length}`);
    tasks.forEach(t => {
        console.log(`- Task ${t.title} (Status: ${t.status}, assignedTo: ${t.assignedTo})`);
    });
    process.exit(0);
  });

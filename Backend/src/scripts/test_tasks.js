import mongoose from 'mongoose';
import Task from './models/Task.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const tasks = await Task.find({ $or: [{ assignedTo: '69ef727f76030d09b83a256c' }, { status: 'Pending Sales Review' }] });
    console.log(`Sales Tasks: ${tasks.length}`);
    tasks.forEach(t => {
        console.log(`- ${t.title} (Status: ${t.status}, assignedTo: ${t.assignedTo})`);
    });
    process.exit(0);
  });

import mongoose from 'mongoose';
import Project from './Backend/models/Project.js';
import Quotation from './Backend/models/Quotation.js';
import dotenv from 'dotenv';
dotenv.config({ path: './Backend/.env' });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const projects = await Project.find().populate('quotation');
    console.log(`Total projects: ${projects.length}`);
    projects.forEach(p => {
        console.log(`- Project ${p.name} (Quotation: ${p.quotation?._id}, createdBy: ${p.quotation?.createdBy})`);
    });
    process.exit(0);
  });

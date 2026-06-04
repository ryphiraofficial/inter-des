import mongoose from 'mongoose';
import Project from './models/Project.js';
import Quotation from './models/Quotation.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const projects = await Project.find().populate('quotation');
    console.log(`Total projects: ${projects.length}`);
    projects.forEach(p => {
        console.log(`- Project ${p.name} (Quotation: ${p.quotation?._id}, quotationCreatedBy: ${p.quotation?.createdBy}, projectStage: ${p.stage})`);
    });
    process.exit(0);
  });

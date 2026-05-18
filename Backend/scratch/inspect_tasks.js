const mongoose = require('mongoose');
const Task = require('../models/Task');
const Quotation = require('../models/Quotation');
const Project = require('../models/Project');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('--- MongoDB Connected ---');
    
    const tasks = await Task.find({});
    console.log(`Total Tasks Found: ${tasks.length}`);
    
    for (const task of tasks) {
      console.log(`\nTask ID: ${task._id}`);
      console.log(`Title: ${task.title}`);
      console.log(`Status: ${task.status}`);
      console.log(`Project Field in DB: ${task.project}`);
      console.log(`Quotation Field in DB: ${task.quotation}`);
      
      if (task.project) {
        const isProject = await Project.findById(task.project);
        if (isProject) {
          console.log(`  -> Project Field is indeed a PROJECT: "${isProject.name || isProject.projectName}" (Stage: ${isProject.stage})`);
        } else {
          const isQuotation = await Quotation.findById(task.project);
          if (isQuotation) {
            console.log(`  -> Project Field is actually a QUOTATION: "${isQuotation.projectName}" (Status: ${isQuotation.status})`);
            
            // Find if a project exists for this quotation
            const matchingProject = await Project.findOne({ quotation: task.project });
            if (matchingProject) {
              console.log(`     -> A Project EXISTS for this Quotation: "${matchingProject.name}" (ID: ${matchingProject._id}, Stage: ${matchingProject.stage})`);
            } else {
              console.log(`     -> NO Project exists for this Quotation yet.`);
            }
          } else {
            console.log(`  -> Project Field points to nothing.`);
          }
        }
      }
      
      if (task.quotation) {
        const isQuotation = await Quotation.findById(task.quotation);
        if (isQuotation) {
          console.log(`  -> Quotation Field is a valid QUOTATION: "${isQuotation.projectName}" (Status: ${isQuotation.status})`);
        } else {
          console.log(`  -> Quotation Field points to nothing.`);
        }
      }
    }
    
    console.log('\n--- Checking All Projects in Database ---');
    const projects = await Project.find({});
    console.log(`Total Projects in DB: ${projects.length}`);
    for (const p of projects) {
      console.log(`- Project ID: ${p._id}, Name: ${p.name || p.projectName}, Stage: ${p.stage}, Status: ${p.status}, Quotation ref: ${p.quotation}`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

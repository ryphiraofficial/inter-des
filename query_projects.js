const mongoose = require('mongoose');
const Project = require('./Backend/models/Project');
const Quotation = require('./Backend/models/Quotation');
require('dotenv').config({ path: './Backend/.env' });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const projects = await Project.find().populate('quotation');
    console.log(`Total projects: ${projects.length}`);
    projects.forEach(p => {
        console.log(`- Project ${p.name} (Quotation: ${p.quotation?._id}, createdBy: ${p.quotation?.createdBy})`);
    });
    process.exit(0);
  });

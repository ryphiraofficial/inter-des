const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');
const MaterialRequest = require('../models/MaterialRequest');
const ProductionProject = require('../models/ProductionProject');
const Invoice = require('../models/Invoice');
const projectController = require('../controllers/projectController');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');

    // 1. Create a dummy project
    const project = await Project.create({
      name: 'Test Project Cascade',
      description: 'Temporary project to test cascade delete',
      client: '69ca0ffe17bff953867a1ac6',
      quotation: '6a0d5e060461ce6c680aa44d',
      stage: 'Accounts',
      createdBy: '69e881640835ba3d1087dff8'
    });
    const projectId = project._id;
    console.log('Created test project:', projectId);

    // 2. Create related dummy documents
    const task = await Task.create({
      title: 'Test Design Task',
      project: projectId,
      dueDate: new Date(),
      status: 'To Do',
      createdBy: '69e881640835ba3d1087dff8'
    });
    console.log('Created test task:', task._id);

    const mr = await MaterialRequest.create({
      project: projectId,
      status: 'Pending',
      requestedBy: '69e881640835ba3d1087dff8',
      createdBy: '69e881640835ba3d1087dff8'
    });
    console.log('Created test material request:', mr._id);

    const pp = await ProductionProject.create({
      projectName: 'Test Production Project',
      sourceProject: projectId,
      projectManager: '69e881640835ba3d1087dff8',
      status: 'Planning',
      createdBy: '69e881640835ba3d1087dff8'
    });
    console.log('Created test production project:', pp._id);

    const invoice = await Invoice.create({
      project: projectId,
      client: '69ca0ffe17bff953867a1ac6',
      grandTotal: 1000,
      dueDate: new Date(),
      createdBy: '69e881640835ba3d1087dff8'
    });
    console.log('Created test invoice:', invoice._id);

    // 3. Call the deleteProject controller method mockup
    const mockReq = {
      params: { id: projectId.toString() },
      user: { id: '69e881640835ba3d1087dff8' }
    };
    const mockRes = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (obj) {
        this.body = obj;
        return this;
      }
    };

    console.log('Running deleteProject...');
    await projectController.deleteProject(mockReq, mockRes);
    console.log('Response Status:', mockRes.statusCode);
    console.log('Response JSON:', mockRes.body);

    // 4. Verify deletion
    const projCheck = await Project.findById(projectId);
    const taskCheck = await Task.findById(task._id);
    const mrCheck = await MaterialRequest.findById(mr._id);
    const ppCheck = await ProductionProject.findById(pp._id);
    const invCheck = await Invoice.findById(invoice._id);

    console.log('--- Post-Deletion Verifications ---');
    console.log('Project still exists:', !!projCheck);
    console.log('Task still exists:', !!taskCheck);
    console.log('MaterialRequest still exists:', !!mrCheck);
    console.log('ProductionProject still exists:', !!ppCheck);
    console.log('Invoice still exists:', !!invCheck);

    if (!projCheck && !taskCheck && !mrCheck && !ppCheck && !invCheck) {
      console.log('SUCCESS: All cascade deletes executed correctly!');
    } else {
      console.log('FAILURE: Some cascade deletes did not execute.');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });

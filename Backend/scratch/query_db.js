const mongoose = require('mongoose');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    const projectId = "6a0d5e3f0461ce6c680aa61c";
    
    const project = await Project.findById(projectId);
    console.log('Project stage:', project.stage);
    console.log('Project paymentCollectionStatus:', project.paymentCollectionStatus);
    console.log('Project paymentStatus:', project.paymentStatus);
    console.log('Project tempCollectionDetails:', project.tempCollectionDetails);
    console.log('Project notes:', project.notes);

    const payments = await Payment.find({ project: projectId });
    console.log(`Payments found: ${payments.length}`);
    console.log(JSON.stringify(payments, null, 2));

    const invoice = await Invoice.findOne({ project: projectId });
    if (invoice) {
      console.log('Invoice status:', invoice.status);
      console.log('Invoice amountPaid:', invoice.amountPaid);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

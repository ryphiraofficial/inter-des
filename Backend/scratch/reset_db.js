const mongoose = require('mongoose');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    const projectId = "6a0d5e3f0461ce6c680aa61c";

    // 1. Delete all payments for this project
    const delRes = await Payment.deleteMany({ project: projectId });
    console.log(`Deleted ${delRes.deletedCount} payments.`);

    // 2. Reset project
    const project = await Project.findById(projectId);
    project.stage = 'Procurement';
    project.paymentCollectionStatus = 'Collected';
    project.paymentStatus = 'Pending Advance';
    project.collectedAmount = 0;
    project.tempCollectionDetails = {
      collectedAt: new Date(),
      collectedBy: "69e881650835ba3d1087e010",
      paymentMethod: "Cash",
      reference: "74185296",
      notes: "ASDFGH",
      amount: 1460
    };
    // Clean up notes
    project.notes = "[Payment Collected by Staff: Ganesh Pillai]\nMode: Cash\nReference: 74185296\nNotes: ASDFGH";
    await project.save();
    console.log('Project reset successfully.');

    // 3. Reset invoice
    const invoice = await Invoice.findOne({ project: projectId });
    if (invoice) {
      invoice.status = 'Unpaid';
      invoice.amountPaid = 0;
      await invoice.save();
      console.log('Invoice reset successfully.');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

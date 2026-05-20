const mongoose = require('mongoose');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Quotation = require('../models/Quotation');
const Client = require('../models/Client');
const User = require('../models/User');
const { verifyPaymentAndRelease } = require('../controllers/accountsController');
require('dotenv').config();

// Stub req, res
const req = {
  body: {
    projectId: "6a0d5e3f0461ce6c680aa61c",
    collectedAmount: 1460,
    paymentNotes: "Verified and approved by Accounts Manager."
  },
  user: {
    id: "69e881650835ba3d1087e00e",
    fullName: "Lakshmi Iyer"
  }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.data = data;
    console.log('Response Status:', this.statusCode || 200);
    console.log('Response JSON:', JSON.stringify(data, null, 2));
  }
};

// Global helper mocks
global.createNotification = async (notif) => {
  console.log('Mock notification created:', notif);
  return { success: true };
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    console.log('Running verifyPaymentAndRelease...');
    await verifyPaymentAndRelease(req, res);
    
    // Inspect database after running
    const project = await Project.findById(req.body.projectId);
    console.log('\n--- Post-Verification Inspection ---');
    console.log('Project Stage:', project.stage);
    console.log('Project paymentCollectionStatus:', project.paymentCollectionStatus);
    console.log('Project paymentStatus:', project.paymentStatus);
    console.log('Project tempCollectionDetails:', project.tempCollectionDetails);
    
    const payments = await Payment.find({ project: req.body.projectId });
    console.log(`Payments found: ${payments.length}`);
    console.log(JSON.stringify(payments, null, 2));
    
    const invoice = await Invoice.findOne({ project: req.body.projectId });
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

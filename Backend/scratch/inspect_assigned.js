const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const Staff = require('../models/Staff');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('--- MongoDB Connected ---');
    
    console.log('\n--- Accounts Staff Users ---');
    const users = await User.find({ role: 'Accounts Staff' });
    for (const u of users) {
      console.log(`User ID: ${u._id}, FullName: ${u.fullName}, Email: ${u.email}, StaffID: ${u.staffId}`);
    }

    console.log('\n--- Accounts Staff from Staff model ---');
    const staffs = await Staff.find({ role: 'Accounts Staff' });
    for (const s of staffs) {
      console.log(`Staff ID: ${s._id}, Name: ${s.name}, Email: ${s.email}, StaffID: ${s.staffId}`);
    }

    console.log('\n--- Projects with assignedAccountsStaff ---');
    const projects = await Project.find({ assignedAccountsStaff: { $exists: true, $ne: null } });
    console.log(`Projects with assignedAccountsStaff count: ${projects.length}`);
    for (const p of projects) {
      console.log(`Project ID: ${p._id}, Name: ${p.name}, Assigned Field Value: ${p.assignedAccountsStaff}`);
      
      const inUser = await User.findById(p.assignedAccountsStaff);
      const inStaff = await Staff.findById(p.assignedAccountsStaff);
      
      console.log(`  -> Exists in User collection? ${inUser ? 'YES (' + inUser.fullName + ')' : 'NO'}`);
      console.log(`  -> Exists in Staff collection? ${inStaff ? 'YES (' + inStaff.name + ')' : 'NO'}`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

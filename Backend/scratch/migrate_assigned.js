const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const Staff = require('../models/Staff');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('--- Database Repair/Migration Started ---');
    const projects = await Project.find({ assignedAccountsStaff: { $exists: true, $ne: null } });
    console.log(`Checking ${projects.length} assigned projects...`);
    
    let repairedCount = 0;
    for (const p of projects) {
      // Check if it matches a Staff ID
      const staff = await Staff.findById(p.assignedAccountsStaff);
      if (staff) {
        console.log(`Project "${p.name}" (ID: ${p._id}) is assigned to Staff ID: ${staff._id} (${staff.name})`);
        
        // Find corresponding User
        const user = await User.findOne({
          $or: [
            { staffId: staff.staffId },
            { email: staff.email.toLowerCase() }
          ]
        });
        
        if (user) {
          console.log(`  -> Found corresponding User ID: ${user._id} (${user.fullName})`);
          p.assignedAccountsStaff = user._id;
          await p.save();
          console.log(`  -> Repaired project assignment!`);
          repairedCount++;
        } else {
          console.log(`  -> WARNING: Corresponding User NOT found for Staff: ${staff.name}`);
        }
      } else {
        console.log(`Project "${p.name}" is already assigned to a non-Staff ID (likely User ID): ${p.assignedAccountsStaff}`);
      }
    }
    
    console.log(`\nMigration completed. Repaired ${repairedCount} projects.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

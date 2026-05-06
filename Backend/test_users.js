const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const users = await User.find({ role: { $regex: 'sales', $options: 'i' } });
    console.log(`Sales users: ${users.length}`);
    users.forEach(u => {
        console.log(`- ${u.fullName} (ID: ${u._id}, Role: ${u.role})`);
    });
    process.exit(0);
  });

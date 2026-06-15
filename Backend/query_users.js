import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const users = mongoose.connection.collection('users');
    const roles = await users.distinct('role');
    console.log('Available Roles:', roles);
    
    const peUsers = await users.find({ role: 'Project Engineer' }).toArray();
    console.log('Project Engineers:', peUsers.length);
    
    const pmUsers = await users.find({ role: 'Project Manager' }).toArray();
    console.log('Project Managers:', pmUsers.length);

    const seUsers = await users.find({ role: 'Site Engineer' }).toArray();
    console.log('Site Engineers:', seUsers.length);

    process.exit(0);
  });

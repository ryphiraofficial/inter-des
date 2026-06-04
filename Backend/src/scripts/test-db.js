import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import ProductionProject from './models/ProductionProject.js';
import User from './models/User.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interior-design').then(async () => {
    console.log("Connected to DB");
    const projects = await ProductionProject.find();
    console.log("Projects in DB:", projects.length);
    const users = await User.find({ role: 'Project Manager' });
    console.log("PMs:", users.map(u => u.fullName));
    process.exit(0);
});

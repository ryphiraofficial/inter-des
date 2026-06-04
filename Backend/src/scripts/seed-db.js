import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js';

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const users = await User.find({}, 'fullName role');
    console.log(users);
    process.exit(0);
}).catch(console.error);

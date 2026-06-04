// This script simulates the backend response to see if "Priya" is sent properly.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const db = mongoose.connection.db;
    const admin = await db.collection('users').findOne({ email: 'admin@interiordesign.com' });
    console.log(admin);
    mongoose.disconnect();
  });

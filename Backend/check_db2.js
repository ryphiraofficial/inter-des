import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('quotations').findOne(
        { "items.itemName": "king size coat" }, 
        { projection: { items: 1 } }
    );
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
check();

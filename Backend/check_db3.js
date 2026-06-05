import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('quotations').findOne(
        { "items.itemName": "king size coat" }
    );
    if(result && result.items) {
      const item = result.items.find(i => i.itemName === "king size coat");
      console.log(JSON.stringify(item, null, 2));
    } else {
      console.log("Not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
check();

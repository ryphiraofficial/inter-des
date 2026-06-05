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
    
    if (result && result.items) {
      const kingItem = result.items.find(i => i.itemName === "king size coat");
      console.log(JSON.stringify(kingItem, null, 2));
    } else {
      console.log("Item not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
check();

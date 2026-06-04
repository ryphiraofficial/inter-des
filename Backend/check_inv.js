import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const coll = mongoose.connection.collection('inventories');
    const items = await coll.find({}).toArray();
    
    console.log("Total items:", items.length);
    const noCostPrice = items.filter(i => i.costPrice == null);
    console.log("Items without costPrice:", noCostPrice.length);
    if(noCostPrice.length > 0) {
        console.log(noCostPrice.slice(0, 3));
    }
    process.exit(0);
  });

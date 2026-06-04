import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const coll = mongoose.connection.collection('inventories');
    const result = await coll.updateMany(
        { costPrice: { $exists: false } },
        { $set: { costPrice: 0 } }
    );
    console.log(`Updated ${result.modifiedCount} items to have costPrice: 0`);
    process.exit(0);
  });

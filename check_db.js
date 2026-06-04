import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './Backend/.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const coll = mongoose.connection.collection('quotations');
    const q = await coll.findOne({ _id: new mongoose.Types.ObjectId("6a211124832025005f2ca6d3") });
    if (q) {
      console.log(JSON.stringify(q.items.slice(0, 5), null, 2));
    } else {
      console.log("Not found in db");
    }
    process.exit(0);
  });

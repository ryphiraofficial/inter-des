import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const QuotationSchema = new mongoose.Schema({}, { strict: false });
const Quotation = mongoose.model('Quotation', QuotationSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const q = await Quotation.findById('6a211124832025005f2ca6d3');
    q.items[1].cmL = 400;
    q.items[1].cmH = 400;
    q.markModified('items');
    await q.save();
    console.log("Updated via script");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
check();

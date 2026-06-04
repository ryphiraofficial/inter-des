import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const QuotationSchema = new mongoose.Schema({}, { strict: false });
const Quotation = mongoose.model('Quotation', QuotationSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const q = await Quotation.findById('6a211124832025005f2ca6d3').lean();
    console.log("Quotation Items from DB:");
    q.items.forEach((item, i) => {
      console.log(`Item ${i}: "${item.itemName}" | unit="${item.unit}" | cmL=${item.cmL} | cmH=${item.cmH} | sqft=${item.sqft} | size="${item.size}"`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
check();

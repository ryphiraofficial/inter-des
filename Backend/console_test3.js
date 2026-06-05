import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const QuotationSchema = new mongoose.Schema({}, { strict: false });
const Quotation = mongoose.model('Quotation', QuotationSchema);

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // Find the quotation
    const q = await Quotation.findById('6a211124832025005f2ca6d3');
    if (!q) {
        console.log("Quotation not found");
        return;
    }
    
    // Hardcode some dimensions for testing
    let updated = false;
    q.items.forEach(item => {
        if (item.unit && item.unit.toLowerCase().includes('sq')) {
            item.cmL = 400;
            item.cmH = 400;
            item.cmD = 50;
            item.sqft = 177.78;
            item.size = "177.78 SFT";
            updated = true;
        }
    });

    if (updated) {
        q.markModified('items');
        await q.save();
        console.log("Successfully manually saved cmL, cmH, cmD to the DB.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
fix();

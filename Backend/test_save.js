import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import Quotation from './src/models/sales/Quotation.js';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
        const dummyQuote = new Quotation({
            quotationNumber: 'TEST-' + Date.now(),
            client: new mongoose.Types.ObjectId(), // Dummy client ID
            projectName: 'Test Project',
            createdBy: new mongoose.Types.ObjectId(),
            items: [{
                itemName: 'Test Item',
                unit: 'Sq Ft',
                size: '111.11 SFT',
                quantity: 98.11,
                rate: 2500,
                amount: 245275,
                cmL: 100,
                cmD: 50,
                cmH: 200
            }]
        });
        
        await dummyQuote.save();
        
        // Fetch it back
        const fetched = await Quotation.findById(dummyQuote._id);
        console.log("FETCHED ITEMS:", JSON.stringify(fetched.items, null, 2));
        
        // Clean up
        await Quotation.deleteOne({ _id: dummyQuote._id });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
  });

import mongoose from 'mongoose';
import Brand from '../models/procurement/Brand.js';
import LaminationItem from '../models/library/LaminationItem.js';
import EdgeBandItem from '../models/library/EdgeBandItem.js';
import LaminateEdgeBandMatch from '../models/procurement/LaminateEdgeBandMatch.js';
import InventoryEdgeBand from '../models/procurement/EdgeBand.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ryphira:ryphira@cluster0.vhnowt2.mongodb.net/InteriorSoftware?appName=Cluster0';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create Brands
        const merinoBrand = await Brand.findOneAndUpdate(
            { name: 'Merino' },
            { name: 'Merino', type: 'BOTH' },
            { upsert: true, new: true }
        );

        const greenlamBrand = await Brand.findOneAndUpdate(
            { name: 'Greenlam' },
            { name: 'Greenlam', type: 'BOTH' },
            { upsert: true, new: true }
        );

        const rehauBrand = await Brand.findOneAndUpdate(
            { name: 'Rehau' },
            { name: 'Rehau', type: 'EDGE_BAND' },
            { upsert: true, new: true }
        );

        // Create Lamination Items
        const lam1 = await LaminationItem.findOneAndUpdate(
            { brandId: merinoBrand._id, code: '1123' },
            { brandId: merinoBrand._id, brandName: 'Merino', code: '1123', name: 'Walnut Natural', color: 'Brown', finish: 'Suede' },
            { upsert: true, new: true }
        );

        const lam2 = await LaminationItem.findOneAndUpdate(
            { brandId: greenlamBrand._id, code: '1025' },
            { brandId: greenlamBrand._id, brandName: 'Greenlam', code: '1025', name: 'Royal Teak', color: 'Teak', finish: 'Matt' },
            { upsert: true, new: true }
        );

        // Create Edge Band Items
        const eb1 = await EdgeBandItem.findOneAndUpdate(
            { brandId: rehauBrand._id, code: '1025' },
            { brandId: rehauBrand._id, brandName: 'Rehau', code: '1025', name: 'Walnut Edge', color: 'Brown', finish: 'Suede' },
            { upsert: true, new: true }
        );

        const eb2 = await EdgeBandItem.findOneAndUpdate(
            { brandId: merinoBrand._id, code: 'EB-1123' },
            { brandId: merinoBrand._id, brandName: 'Merino', code: 'EB-1123', name: 'Walnut Matching Band', color: 'Brown', finish: 'Suede' },
            { upsert: true, new: true }
        );

        // Ensure inventory stock entries exist
        await InventoryEdgeBand.findOneAndUpdate(
            { code: '1025' },
            { code: '1025', brandName: 'Rehau', brandId: rehauBrand._id, color: 'Brown', finish: 'Suede', stockQtyM: 150, status: 'In Stock' },
            { upsert: true }
        );

        await InventoryEdgeBand.findOneAndUpdate(
            { code: 'EB-1123' },
            { code: 'EB-1123', brandName: 'Merino', brandId: merinoBrand._id, color: 'Brown', finish: 'Suede', stockQtyM: 80, status: 'In Stock' },
            { upsert: true }
        );

        // Create Library Matches (Merino 1123 -> Rehau 1025 & Merino EB-1123)
        await LaminateEdgeBandMatch.findOneAndUpdate(
            { laminationItemId: lam1._id, edgeBandItemId: eb1._id },
            { laminationItemId: lam1._id, edgeBandItemId: eb1._id, matchPercent: 95 },
            { upsert: true }
        );

        await LaminateEdgeBandMatch.findOneAndUpdate(
            { laminationItemId: lam1._id, edgeBandItemId: eb2._id },
            { laminationItemId: lam1._id, edgeBandItemId: eb2._id, matchPercent: 100 },
            { upsert: true }
        );

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}

seed();

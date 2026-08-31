import '../../env.js';
import mongoose from 'mongoose';
import Brand from '../models/procurement/Brand.js';
import Laminate from '../models/procurement/Laminate.js';
import EdgeBand from '../models/procurement/EdgeBand.js';
import LaminateEdgeBandMatch from '../models/procurement/LaminateEdgeBandMatch.js';

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected! Seeding Inventory Brands, Laminates, Edge Bands, and Matches...');

        // 1. Brands
        const brandNames = ['Merino', 'Stylam', 'Newmika', 'Rehau', 'Greenlam'];
        const brandDocs = {};

        for (const bName of brandNames) {
            const brand = await Brand.findOneAndUpdate(
                { name: bName },
                { name: bName, codeSeries: `${bName.substring(0, 3).toUpperCase()}-SERIES`, supplier: `${bName} India` },
                { upsert: true, new: true }
            );
            brandDocs[bName] = brand;
        }

        // 2. Laminates
        const laminatesData = [
            {
                code: 'LAM-MER-101',
                name: 'Walnut Natural Sheet',
                brandName: 'Merino',
                brandId: brandDocs['Merino']._id,
                color: 'Natural Walnut',
                finish: 'Matt',
                thicknessMm: 1.0,
                sheetSize: '8x4 ft',
                stockQty: 18,
                reorderLevel: 5,
                price: 1850,
                costPrice: 1400,
                supplier: 'Merino Laminates',
                location: 'Rack A-12'
            },
            {
                code: 'LAM-MER-102',
                name: 'Oak Classic Grain',
                brandName: 'Merino',
                brandId: brandDocs['Merino']._id,
                color: 'Light Oak',
                finish: 'Wood Grain',
                thicknessMm: 1.0,
                sheetSize: '8x4 ft',
                stockQty: 3,
                reorderLevel: 5,
                price: 1950,
                costPrice: 1500,
                supplier: 'Merino Laminates',
                location: 'Rack A-14'
            },
            {
                code: 'LAM-STY-201',
                name: 'High Gloss Pure White',
                brandName: 'Stylam',
                brandId: brandDocs['Stylam']._id,
                color: 'Pure White',
                finish: 'High Gloss',
                thicknessMm: 0.8,
                sheetSize: '8x4 ft',
                stockQty: 25,
                reorderLevel: 10,
                price: 2100,
                costPrice: 1650,
                supplier: 'Stylam Direct',
                location: 'Rack B-04'
            },
            {
                code: 'LAM-NEW-301',
                name: 'Royal Teak Dark',
                brandName: 'Newmika',
                brandId: brandDocs['Newmika']._id,
                color: 'Dark Brown',
                finish: 'Satin',
                thicknessMm: 1.0,
                sheetSize: '8x4 ft',
                stockQty: 0,
                reorderLevel: 5,
                price: 1750,
                costPrice: 1300,
                supplier: 'Newmika Dist',
                location: 'Rack C-01'
            }
        ];

        const laminateDocs = {};
        for (const lam of laminatesData) {
            let doc = await Laminate.findOne({ code: lam.code });
            if (!doc) {
                doc = new Laminate(lam);
                await doc.save();
            } else {
                Object.assign(doc, lam);
                await doc.save();
            }
            laminateDocs[lam.code] = doc;
        }

        // 3. Edge Bands
        const edgeBandsData = [
            {
                code: 'EB-MER-W01',
                batch: 'BATCH-W-101',
                color: 'Natural Walnut',
                finish: 'Matt',
                widthMm: 22,
                thicknessMm: 0.8,
                rollLengthM: 50,
                stockQtyM: 150,
                reorderLevelM: 30,
                pricePerMeter: 18,
                supplier: 'Merino Edge',
                location: 'Shelf E-01',
                brandName: 'Merino',
                brandId: brandDocs['Merino']._id
            },
            {
                code: 'EB-MER-W02',
                batch: 'BATCH-W-102',
                color: 'Walnut Dark',
                finish: 'Matt',
                widthMm: 22,
                thicknessMm: 2.0,
                rollLengthM: 50,
                stockQtyM: 15,
                reorderLevelM: 25,
                pricePerMeter: 35,
                supplier: 'Merino Edge',
                location: 'Shelf E-02',
                brandName: 'Merino',
                brandId: brandDocs['Merino']._id
            },
            {
                code: 'EB-REH-O01',
                batch: 'BATCH-R-888',
                color: 'Light Oak',
                finish: 'Wood Grain',
                widthMm: 22,
                thicknessMm: 0.8,
                rollLengthM: 50,
                stockQtyM: 200,
                reorderLevelM: 40,
                pricePerMeter: 22,
                supplier: 'Rehau India',
                location: 'Shelf E-05',
                brandName: 'Rehau',
                brandId: brandDocs['Rehau']._id
            },
            {
                code: 'EB-STY-G01',
                batch: 'BATCH-S-901',
                color: 'Pure White',
                finish: 'High Gloss',
                widthMm: 45,
                thicknessMm: 0.8,
                rollLengthM: 50,
                stockQtyM: 0,
                reorderLevelM: 20,
                pricePerMeter: 28,
                supplier: 'Stylam Direct',
                location: 'Shelf F-02',
                brandName: 'Stylam',
                brandId: brandDocs['Stylam']._id
            }
        ];

        const edgeBandDocs = {};
        for (const eb of edgeBandsData) {
            let doc = await EdgeBand.findOne({ code: eb.code });
            if (!doc) {
                doc = new EdgeBand(eb);
                await doc.save();
            } else {
                Object.assign(doc, eb);
                await doc.save();
            }
            edgeBandDocs[eb.code] = doc;
        }

        // 4. Laminate ↔ EdgeBand Matches
        const matchesData = [
            {
                laminateId: laminateDocs['LAM-MER-101']._id,
                edgeBandId: edgeBandDocs['EB-MER-W01']._id,
                matchPercent: 95,
                isPrimary: true,
                notes: 'Primary 22x0.8mm match for Merino Walnut Natural'
            },
            {
                laminateId: laminateDocs['LAM-MER-101']._id,
                edgeBandId: edgeBandDocs['EB-MER-W02']._id,
                matchPercent: 85,
                isPrimary: false,
                notes: 'Heavy duty 22x2mm option'
            },
            {
                laminateId: laminateDocs['LAM-MER-102']._id,
                edgeBandId: edgeBandDocs['EB-REH-O01']._id,
                matchPercent: 90,
                isPrimary: true,
                notes: 'Rehau Premium Oak match'
            },
            {
                laminateId: laminateDocs['LAM-STY-201']._id,
                edgeBandId: edgeBandDocs['EB-STY-G01']._id,
                matchPercent: 100,
                isPrimary: true,
                notes: 'Exact factory match'
            }
        ];

        for (const m of matchesData) {
            await LaminateEdgeBandMatch.findOneAndUpdate(
                { laminateId: m.laminateId, edgeBandId: m.edgeBandId },
                m,
                { upsert: true, new: true }
            );
        }

        console.log('✅ Inventory Edge Bands & Matches seed data completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding inventory edge bands data:', error);
        process.exit(1);
    }
};

seedData();

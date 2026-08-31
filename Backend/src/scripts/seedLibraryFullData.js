import mongoose from 'mongoose';
import Brand from '../models/procurement/Brand.js';
import LaminationItem from '../models/library/LaminationItem.js';
import EdgeBandItem from '../models/library/EdgeBandItem.js';
import LaminateEdgeBandMatch from '../models/procurement/LaminateEdgeBandMatch.js';
import InventoryEdgeBand from '../models/procurement/EdgeBand.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ryphira:ryphira@cluster0.vhnowt2.mongodb.net/InteriorSoftware?appName=Cluster0';

const laminationData = [
    { brand: 'Merino', code: '1121', name: 'Ivory White', finish: 'Matt' },
    { brand: 'Merino', code: '1122', name: 'Pearl Grey', finish: 'Matt' },
    { brand: 'Merino', code: '1123', name: 'Walnut Natural', finish: 'Matt' },
    { brand: 'Merino', code: '1124', name: 'Teak Brown', finish: 'Wood Grain' },
    { brand: 'Merino', code: '1125', name: 'Metallic Silver', finish: 'High Gloss' },
    { brand: 'Merino', code: '1126', name: 'Cherry Red', finish: 'Satin' },

    { brand: 'Century', code: '3238', name: 'Silica Grey', finish: 'Matt' },
    { brand: 'Century', code: '3147', name: 'Blush Pink', finish: 'Matt' },
    { brand: 'Century', code: '211', name: 'Terra Brown', finish: 'Matt' },
    { brand: 'Century', code: '213', name: 'Sun Burn Orange', finish: 'High Gloss' },
    { brand: 'Century', code: '3165', name: 'Ginger Bread', finish: 'Wood Grain' },
    { brand: 'Century', code: '238', name: 'Graphite Grey', finish: 'Matt' },
    { brand: 'Century', code: '902', name: 'Black Soir', finish: 'High Gloss' },

    { brand: 'Stylam', code: '2345', name: 'Oak Classic', finish: 'Wood Grain' },
    { brand: 'Stylam', code: '2346', name: 'Walnut Dark', finish: 'Wood Grain' },
    { brand: 'Stylam', code: '2347', name: 'Oak Grey', finish: 'Matt' },
    { brand: 'Stylam', code: '2348', name: 'Beige Sand', finish: 'Matt' },
    { brand: 'Stylam', code: '2349', name: 'Rosewood', finish: 'Wood Grain' },
    { brand: 'Stylam', code: '2350', name: 'Navy Blue', finish: 'Matt' },

    { brand: 'Greenlam', code: 'G101', name: 'White Frost', finish: 'Matt' },
    { brand: 'Greenlam', code: 'G102', name: 'Coffee Brown', finish: 'Wood Grain' },
    { brand: 'Greenlam', code: 'G103', name: 'Charcoal Black', finish: 'High Gloss' },
    { brand: 'Greenlam', code: 'G104', name: 'Almond Beige', finish: 'Matt' },
    { brand: 'Greenlam', code: 'G105', name: 'Mint Green', finish: 'Satin' }
];

const edgeBandData = [
    { brand: 'Rehau', code: '75746', name: 'Silica Grey Match', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Rehau', code: '75745', name: 'Graphite Grey Match', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Rehau', code: '75712', name: 'Black Soir Match', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Rehau', code: '110205', name: 'Blush Pink Match', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Rehau', code: '110121', name: 'Terra Brown Match', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Rehau', code: '112450', name: 'Sun Burn Match', widthMm: 19, thicknessMm: 1.0 },
    { brand: 'Rehau', code: '112451', name: 'Ginger Bread Match', widthMm: 22, thicknessMm: 2.0 },

    { brand: 'Zank', code: '1025', name: 'Walnut', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Zank', code: '1150', name: 'Disc Grey', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Zank', code: '1151', name: 'Oak Beige', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Zank', code: '1152', name: 'Navy Blue', widthMm: 19, thicknessMm: 1.0 },

    { brand: 'Doellken', code: 'D201', name: 'Oak Woodgrain', widthMm: 22, thicknessMm: 2.0 },
    { brand: 'Doellken', code: 'D202', name: 'Walnut Dark', widthMm: 22, thicknessMm: 2.0 },
    { brand: 'Doellken', code: 'D203', name: 'Rosewood', widthMm: 22, thicknessMm: 2.0 },
    { brand: 'Doellken', code: 'D204', name: 'Coffee Brown', widthMm: 19, thicknessMm: 1.0 },

    { brand: 'B3', code: 'B301', name: 'Ivory Match', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'B3', code: 'B302', name: 'Pearl Grey Match', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'B3', code: 'B303', name: 'Metallic Silver Match', widthMm: 19, thicknessMm: 1.0 },
    { brand: 'B3', code: 'B304', name: 'Cherry Red Match', widthMm: 19, thicknessMm: 1.0 },

    { brand: 'Egger', code: 'E401', name: 'Charcoal Black', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Egger', code: 'E402', name: 'Almond Beige', widthMm: 22, thicknessMm: 1.0 },
    { brand: 'Egger', code: 'E403', name: 'Mint Green', widthMm: 19, thicknessMm: 1.0 },
    { brand: 'Egger', code: 'E404', name: 'White Frost', widthMm: 22, thicknessMm: 1.0 }
];

const matchesData = [
    { laminationBrand: 'Merino', laminationCode: '1121', edgeBandBrand: 'B3', edgeBandCode: 'B301', matchPercent: 100 },
    { laminationBrand: 'Merino', laminationCode: '1121', edgeBandBrand: 'Egger', edgeBandCode: 'E404', matchPercent: 85 },
    { laminationBrand: 'Merino', laminationCode: '1122', edgeBandBrand: 'B3', edgeBandCode: 'B302', matchPercent: 95 },
    { laminationBrand: 'Merino', laminationCode: '1123', edgeBandBrand: 'Zank', edgeBandCode: '1025', matchPercent: 90 },
    { laminationBrand: 'Merino', laminationCode: '1123', edgeBandBrand: 'Doellken', edgeBandCode: 'D202', matchPercent: 85 },
    { laminationBrand: 'Merino', laminationCode: '1123', edgeBandBrand: 'Rehau', edgeBandCode: '110121', matchPercent: 75 },
    { laminationBrand: 'Merino', laminationCode: '1124', edgeBandBrand: 'Doellken', edgeBandCode: 'D204', matchPercent: 90 },
    { laminationBrand: 'Merino', laminationCode: '1124', edgeBandBrand: 'Zank', edgeBandCode: '1150', matchPercent: 70 },
    { laminationBrand: 'Merino', laminationCode: '1125', edgeBandBrand: 'B3', edgeBandCode: 'B303', matchPercent: 100 },
    { laminationBrand: 'Merino', laminationCode: '1126', edgeBandBrand: 'B3', edgeBandCode: 'B304', matchPercent: 95 },

    { laminationBrand: 'Century', laminationCode: '3238', edgeBandBrand: 'Rehau', edgeBandCode: '75746', matchPercent: 95 },
    { laminationBrand: 'Century', laminationCode: '3147', edgeBandBrand: 'Rehau', edgeBandCode: '110205', matchPercent: 90 },
    { laminationBrand: 'Century', laminationCode: '211', edgeBandBrand: 'Rehau', edgeBandCode: '110121', matchPercent: 88 },
    { laminationBrand: 'Century', laminationCode: '213', edgeBandBrand: 'Rehau', edgeBandCode: '112450', matchPercent: 85 },
    { laminationBrand: 'Century', laminationCode: '3165', edgeBandBrand: 'Rehau', edgeBandCode: '112451', matchPercent: 89 },
    { laminationBrand: 'Century', laminationCode: '238', edgeBandBrand: 'Rehau', edgeBandCode: '75745', matchPercent: 93 },
    { laminationBrand: 'Century', laminationCode: '902', edgeBandBrand: 'Rehau', edgeBandCode: '75712', matchPercent: 97 },

    { laminationBrand: 'Stylam', laminationCode: '2345', edgeBandBrand: 'Doellken', edgeBandCode: 'D201', matchPercent: 92 },
    { laminationBrand: 'Stylam', laminationCode: '2346', edgeBandBrand: 'Doellken', edgeBandCode: 'D202', matchPercent: 90 },
    { laminationBrand: 'Stylam', laminationCode: '2346', edgeBandBrand: 'Zank', edgeBandCode: '1025', matchPercent: 80 },
    { laminationBrand: 'Stylam', laminationCode: '2347', edgeBandBrand: 'Zank', edgeBandCode: '1150', matchPercent: 93 },
    { laminationBrand: 'Stylam', laminationCode: '2347', edgeBandBrand: 'Rehau', edgeBandCode: '110121', matchPercent: 78 },
    { laminationBrand: 'Stylam', laminationCode: '2348', edgeBandBrand: 'Doellken', edgeBandCode: 'D204', matchPercent: 85 },
    { laminationBrand: 'Stylam', laminationCode: '2349', edgeBandBrand: 'Doellken', edgeBandCode: 'D203', matchPercent: 94 },
    { laminationBrand: 'Stylam', laminationCode: '2350', edgeBandBrand: 'Zank', edgeBandCode: '1152', matchPercent: 89 },

    { laminationBrand: 'Greenlam', laminationCode: 'G101', edgeBandBrand: 'Egger', edgeBandCode: 'E404', matchPercent: 96 },
    { laminationBrand: 'Greenlam', laminationCode: 'G102', edgeBandBrand: 'Doellken', edgeBandCode: 'D204', matchPercent: 88 },
    { laminationBrand: 'Greenlam', laminationCode: 'G103', edgeBandBrand: 'Egger', edgeBandCode: 'E401', matchPercent: 95 },
    { laminationBrand: 'Greenlam', laminationCode: 'G104', edgeBandBrand: 'Egger', edgeBandCode: 'E402', matchPercent: 90 },
    { laminationBrand: 'Greenlam', laminationCode: 'G105', edgeBandBrand: 'Egger', edgeBandCode: 'E403', matchPercent: 92 }
];

async function seedFullData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const brandMap = new Map();

        // 1. Seed Brands
        const allBrandNames = new Set([
            ...laminationData.map(l => l.brand),
            ...edgeBandData.map(e => e.brand)
        ]);

        for (const brandName of allBrandNames) {
            const isLam = laminationData.some(l => l.brand === brandName);
            const isEb = edgeBandData.some(e => e.brand === brandName);
            const type = (isLam && isEb) ? 'BOTH' : isLam ? 'LAMINATION' : 'EDGE_BAND';

            const brandDoc = await Brand.findOneAndUpdate(
                { name: brandName },
                { name: brandName, type },
                { upsert: true, new: true }
            );
            brandMap.set(brandName, brandDoc._id);
        }
        console.log(`✓ Seeded ${brandMap.size} Brands`);

        // 2. Seed Lamination Items
        const laminationMap = new Map(); // key: "brandName:code" -> _id
        for (const item of laminationData) {
            const brandId = brandMap.get(item.brand);
            const doc = await LaminationItem.findOneAndUpdate(
                { brandId, code: item.code.toUpperCase() },
                {
                    brandId,
                    brandName: item.brand,
                    code: item.code.toUpperCase(),
                    name: item.name,
                    finish: item.finish
                },
                { upsert: true, new: true }
            );
            laminationMap.set(`${item.brand}:${item.code.toUpperCase()}`, doc._id);
        }
        console.log(`✓ Seeded ${laminationData.length} Lamination Items`);

        // 3. Seed Edge Band Items & Inventory Entries
        const edgeBandMap = new Map(); // key: "brandName:code" -> _id
        for (const item of edgeBandData) {
            const brandId = brandMap.get(item.brand);
            const doc = await EdgeBandItem.findOneAndUpdate(
                { brandId, code: item.code.toUpperCase() },
                {
                    brandId,
                    brandName: item.brand,
                    code: item.code.toUpperCase(),
                    name: item.name
                },
                { upsert: true, new: true }
            );
            edgeBandMap.set(`${item.brand}:${item.code.toUpperCase()}`, doc._id);

            // Seed live stock inventory entry
            await InventoryEdgeBand.findOneAndUpdate(
                { code: item.code.toUpperCase() },
                {
                    code: item.code.toUpperCase(),
                    brandName: item.brand,
                    brandId,
                    color: item.name,
                    stockQtyM: 100, // default test stock
                    status: 'In Stock'
                },
                { upsert: true }
            );
        }
        console.log(`✓ Seeded ${edgeBandData.length} Edge Band Items & Live Inventory`);

        // 4. Seed Matches
        let matchCount = 0;
        for (const m of matchesData) {
            const lamId = laminationMap.get(`${m.laminationBrand}:${m.laminationCode.toUpperCase()}`);
            const ebId = edgeBandMap.get(`${m.edgeBandBrand}:${m.edgeBandCode.toUpperCase()}`);

            if (lamId && ebId) {
                await LaminateEdgeBandMatch.findOneAndUpdate(
                    { laminationItemId: lamId, edgeBandItemId: ebId },
                    { laminationItemId: lamId, edgeBandItemId: ebId, matchPercent: m.matchPercent },
                    { upsert: true }
                );
                matchCount++;
            } else {
                console.warn(`Warning: Could not link match ${m.laminationBrand} ${m.laminationCode} -> ${m.edgeBandBrand} ${m.edgeBandCode}`);
            }
        }
        console.log(`✓ Seeded ${matchCount} Lamination <-> Edge Band Matches`);

        console.log('\n🎉 ALL FULL DATA SEEDED SUCCESSFULLY!');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}

seedFullData();

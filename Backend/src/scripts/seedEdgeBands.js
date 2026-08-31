import '../../env.js';
import mongoose from 'mongoose';
import EdgeBand, { FIXED_DIMENSIONS } from '../models/design/EdgeBand.js';

const rawEdgeBandData = [
  {
    "brand": "Merino",
    "code": "EB-MER-001",
    "name": "Walnut Natural",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Merino",
    "code": "EB-101",
    "name": "Walnut Premium",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Merino",
    "code": "EB-MER-002",
    "name": "Walnut Dark",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Merino",
    "code": "EB-MER-003",
    "name": "Oak Natural",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8"]
  },
  {
    "brand": "Greenlam",
    "code": "EB-GRN-001",
    "name": "Classic White",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Greenlam",
    "code": "EB-101",
    "name": "Pure White Premium",
    "finish": "Gloss",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Greenlam",
    "code": "EB-GRN-002",
    "name": "Pearl White",
    "finish": "Gloss",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8"]
  },
  {
    "brand": "Century",
    "code": "EB-CEN-001",
    "name": "Natural Teak",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Century",
    "code": "EB-101",
    "name": "Teak Elegance",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Century",
    "code": "EB-CEN-002",
    "name": "Royal Walnut",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8"]
  },
  {
    "brand": "Rehau",
    "code": "EB-REH-001",
    "name": "Rauwalon Silver",
    "finish": "Metallic",
    "material": "ABS",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Rehau",
    "code": "EB-101",
    "name": "Rauuklet White",
    "finish": "High Gloss",
    "material": "ABS",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Woodarua",
    "code": "EB-WOO-001",
    "name": "Nordic Birch",
    "finish": "Textured",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Woodarua",
    "code": "EB-101",
    "name": "Nordic Oak",
    "finish": "Textured",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Royale Touché",
    "code": "EB-ROY-001",
    "name": "Imperial Gold",
    "finish": "Silk Finish",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  },
  {
    "brand": "Royale Touché",
    "code": "EB-101",
    "name": "Imperial Walnut",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": ["22x0.8", "22x2", "45x0.8", "45x2"]
  }
];

const seedEdgeBands = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected! Seeding edge band master data...');

        for (const item of rawEdgeBandData) {
            const dimensions = FIXED_DIMENSIONS.map(dim => ({
                dimension: dim,
                available: item.dimensions.includes(dim)
            }));

            await EdgeBand.findOneAndUpdate(
                { brand: item.brand, code: item.code.toUpperCase() },
                {
                    brand: item.brand,
                    code: item.code.toUpperCase(),
                    name: item.name,
                    finish: item.finish,
                    material: item.material,
                    dimensions
                },
                { upsert: true, new: true }
            );
        }

        console.log('✅ Edge band master data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding edge band data:', error);
        process.exit(1);
    }
};

seedEdgeBands();

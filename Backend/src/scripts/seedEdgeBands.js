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
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
  },
  {
    "brand": "Merino",
    "code": "EB-MER-002",
    "name": "Walnut Dark",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
  },
  {
    "brand": "Merino",
    "code": "EB-MER-003",
    "name": "Oak Natural",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8"
    ]
  },
  {
    "brand": "Merino",
    "code": "EB-MER-004",
    "name": "Teak",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
  },
  {
    "brand": "Merino",
    "code": "EB-MER-005",
    "name": "Wenge",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8"
    ]
  },
  {
    "brand": "Greenlam",
    "code": "EB-GRN-001",
    "name": "Classic White",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
  },
  {
    "brand": "Greenlam",
    "code": "EB-GRN-002",
    "name": "Pearl White",
    "finish": "Gloss",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8"
    ]
  },
  {
    "brand": "Greenlam",
    "code": "EB-GRN-003",
    "name": "Charcoal Grey",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
  },
  {
    "brand": "Greenlam",
    "code": "EB-GRN-004",
    "name": "Jet Black",
    "finish": "Matt",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
  },
  {
    "brand": "Century",
    "code": "EB-CEN-001",
    "name": "Natural Teak",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
  },
  {
    "brand": "Century",
    "code": "EB-CEN-002",
    "name": "Royal Walnut",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8"
    ]
  },
  {
    "brand": "Century",
    "code": "EB-CEN-003",
    "name": "Light Oak",
    "finish": "Wood Grain",
    "material": "PVC",
    "dimensions": [
      "22x0.8",
      "22x2",
      "45x0.8",
      "45x2"
    ]
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

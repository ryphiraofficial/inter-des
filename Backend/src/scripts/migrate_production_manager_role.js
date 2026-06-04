/**
 * One-time migration: rename legacy 'Production Manager' role → 'Project Manager'
 * Run: node src/scripts/migrate_production_manager_role.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

const result = await mongoose.connection.collection('users').updateMany(
    { role: 'Production Manager' },
    { $set: { role: 'Project Manager', department: 'Production' } }
);

console.log(`✅ Migrated ${result.modifiedCount} user(s) from 'Production Manager' → 'Project Manager'`);
await mongoose.disconnect();
console.log('✅ Done.');

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dns from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
    console.warn('Could not set custom DNS servers:', err.message);
}


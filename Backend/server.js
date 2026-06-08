import './env.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import fs from 'fs';

// Shared
import authRoutes from './src/routes/shared/authRoutes.js';
import clientAuthRoutes from './src/routes/shared/clientAuth.routes.js';
import notificationRoutes from './src/routes/shared/notificationRoutes.js';
import approvalRoutes from './src/routes/shared/approvalRoutes.js';
import aiRoutes from './src/routes/shared/aiRoutes.js';
import uploadRoutes from './src/routes/shared/uploadRoutes.js';
import pushRoutes from './src/routes/shared/pushRoutes.js';
import clientPortalRoutes from './src/routes/shared/clientPortal.routes.js';

// Admin
import userRoutes from './src/routes/admin/userRoutes.js';
import staffRoutes from './src/routes/admin/staffRoutes.js';
import teamRoutes from './src/routes/admin/teamRoutes.js';
import teamMemberRoutes from './src/routes/admin/teamMemberRoutes.js';
import meetingRoutes from './src/routes/admin/meetingRoutes.js';
import leaveRoutes from './src/routes/admin/leaveRoutes.js';
import settingsRoutes from './src/routes/admin/settingsRoutes.js';
import reportRoutes from './src/routes/admin/reportRoutes.js';

// Sales
import clientRoutes from './src/routes/sales/clientRoutes.js';
import quotationRoutes from './src/routes/sales/quotationRoutes.js';
import invoiceRoutes from './src/routes/sales/invoiceRoutes.js';

// Accounts
import accountsRoutes from './src/routes/accounts/accountsRoutes.js';

// Design
import designRoutes from './src/routes/design/designRoutes.js';
import projectRoutes from './src/routes/design/projectRoutes.js';
import taskRoutes from './src/routes/design/taskRoutes.js';
import kanbanTaskRoutes from './src/routes/design/kanbanTaskRoutes.js';
import checklistRoutes from './src/routes/design/checklistRoutes.js';

// Procurement
import procurementRoutes from './src/routes/procurement/procurementRoutes.js';
import vendorRoutes from './src/routes/procurement/vendorRoutes.js';
import purchaseOrderRoutes from './src/routes/procurement/purchaseOrderRoutes.js';
import inventoryRoutes from './src/routes/procurement/inventoryRoutes.js';
import poInventoryRoutes from './src/routes/procurement/poInventoryRoutes.js';

// Production
import productionRoutes from './src/routes/production/productionRoutes.js';
import productionManagementRoutes from './src/routes/production/productionManagementRoutes.js';
import siteVisitRoutes from './src/routes/production/siteVisitRoutes.js';

import errorHandler from './src/middleware/errorHandler.js';
import { checkTaskDeadlines } from './src/utils/notificationHelper.js';
import Staff from './src/models/admin/Staff.js';

const app = express();
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Shared
app.use('/api/auth', authRoutes);
app.use('/api/client-auth', clientAuthRoutes);
app.use('/api/client', clientPortalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// Admin
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team', teamMemberRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportRoutes);

// Sales
app.use('/api/clients', clientRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/invoices', invoiceRoutes);

// Accounts
app.use('/api/accounts', accountsRoutes);

// Design
app.use('/api/design', designRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/kanban-tasks', kanbanTaskRoutes);
app.use('/api/checklists', checklistRoutes);

// Procurement
app.use('/api/procurement', procurementRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/po-inventory', poInventoryRoutes);

// Production
app.use('/api/production', productionRoutes);
app.use('/api/production-management', productionManagementRoutes);
app.use('/api/site-visits', siteVisitRoutes);

app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.use(errorHandler);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 5000;

const migrateStaffIds = async () => {
    try {
        const staffWithoutId = await Staff.find({ $or: [{ staffId: null }, { staffId: { $exists: false } }, { staffId: '' }] });
        if (staffWithoutId.length > 0) {
            console.log(`Migrating ${staffWithoutId.length} staff members without IDs...`);
            for (const staff of staffWithoutId) {
                await staff.save();
            }
            console.log('Staff ID migration complete');
        }
    } catch (err) {
        console.error('Staff ID migration error:', err.message);
    }
};

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
    });
    await migrateStaffIds();
    setTimeout(() => {
        checkTaskDeadlines();
        setInterval(checkTaskDeadlines, 60 * 60 * 1000);
        console.log('Task deadline checker started');
    }, 5000);
};

startServer();

process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

export default app;

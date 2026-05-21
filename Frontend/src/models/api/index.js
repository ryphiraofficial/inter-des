// Models — API Layer
// Barrel file re-exporting all API modules organized by domain

// ── Core ──────────────────────────────────────────────────────────────────────
export { apiCall, getAuthHeaders, API_BASE_URL, BASE_IMAGE_URL } from './core/apiClient';

// ── Shared (cross-domain) ──────────────────────────────────────────────────────
export { authAPI } from './shared/authAPI';
export { notificationAPI } from './shared/notificationAPI';
export { aiAPI } from './shared/aiAPI';
export { meetingAPI } from './shared/meetingAPI';

// ── Admin ─────────────────────────────────────────────────────────────────────
export { clientAPI } from './admin/clientAPI';
export { quotationAPI } from './admin/quotationAPI';
export { inventoryAPI } from './admin/inventoryAPI';
export { projectAPI } from './admin/projectAPI';
export { staffAPI, teamAPI, teamMemberAPI } from './admin/staffAPI';
export { invoiceAPI } from './admin/invoiceAPI';
export { vendorAPI } from './admin/vendorAPI';
export { userAPI } from './admin/userAPI';
export { accountsAPI } from './admin/accountsAPI';
export { reportAPI, settingsAPI } from './admin/reportAPI';
export { uploadAPI, kanbanAPI, approvalAPI } from './admin/miscAPI';

// ── Production ────────────────────────────────────────────────────────────────
export { productionAPI, productionManagerAPI, siteManagementAPI } from './production/productionAPI';
export { engineerAPI } from './production/engineerAPI';
export { leaveAPI } from './production/leaveAPI';

// ── Procurement ───────────────────────────────────────────────────────────────
export { procurementAPI } from './procurement/procurementAPI';
export { purchaseOrderAPI, poInventoryAPI } from './procurement/purchaseOrderAPI';

// ── Design ────────────────────────────────────────────────────────────────────
export { designDashboardAPI } from './design/designAPI';
export { taskAPI, siteVisitAPI } from './design/taskAPI';
export { checklistAPI } from './design/checklistAPI';

// ── Default export (backward compatibility) ───────────────────────────────────
import { authAPI } from './shared/authAPI';
import { clientAPI } from './admin/clientAPI';
import { quotationAPI } from './admin/quotationAPI';
import { inventoryAPI } from './admin/inventoryAPI';
import { projectAPI } from './admin/projectAPI';
import { taskAPI } from './design/taskAPI';
import { procurementAPI } from './procurement/procurementAPI';
import { productionAPI, productionManagerAPI } from './production/productionAPI';
import { engineerAPI } from './production/engineerAPI';
import { purchaseOrderAPI, poInventoryAPI } from './procurement/purchaseOrderAPI';
import { staffAPI, teamAPI, teamMemberAPI } from './admin/staffAPI';
import { invoiceAPI } from './admin/invoiceAPI';
import { vendorAPI } from './admin/vendorAPI';
import { userAPI } from './admin/userAPI';
import { notificationAPI } from './shared/notificationAPI';
import { designDashboardAPI } from './design/designAPI';
import { accountsAPI } from './admin/accountsAPI';
import { reportAPI, settingsAPI } from './admin/reportAPI';
import { aiAPI } from './shared/aiAPI';
import { meetingAPI } from './shared/meetingAPI';
import { checklistAPI } from './design/checklistAPI';
import { kanbanAPI, approvalAPI } from './admin/miscAPI';

export default {
    auth: authAPI,
    clients: clientAPI,
    quotations: quotationAPI,
    inventory: inventoryAPI,
    purchaseOrders: purchaseOrderAPI,
    poInventory: poInventoryAPI,
    tasks: taskAPI,
    teams: teamAPI,
    invoices: invoiceAPI,
    users: userAPI,
    reports: reportAPI,
    notifications: notificationAPI,
    ai: aiAPI,
    staff: staffAPI,
    kanban: kanbanAPI,
    teamMember: teamMemberAPI,
    approvals: approvalAPI,
    settings: settingsAPI,
    projects: projectAPI,
    vendors: vendorAPI,
    procurement: procurementAPI,
    production: productionAPI,
    accounts: accountsAPI,
    checklists: checklistAPI,
    designDashboard: designDashboardAPI,
    engineer: engineerAPI,
    productionManager: productionManagerAPI,
    meetings: meetingAPI
};

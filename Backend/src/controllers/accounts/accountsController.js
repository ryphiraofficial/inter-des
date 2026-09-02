import { createAccount, getAccounts, getAccountById } from '../../services/accounts/accountService.js';
import { createLedger, getLedgers, resolveLedgerForClient, resolveLedgerForVendor } from '../../services/accounts/ledgerService.js';
import { createVoucher, getVouchers, cancelVoucher } from '../../services/accounts/voucherService.js';
import { getPrograms, getProgramById, resolveProgramForProject, clearForProcurement } from '../../services/accounts/programService.js';
import { getDashboardStats } from '../../services/accounts/statsService.js';

// --- Accounts ---
export const addAccount = async (req, res) => {
    try {
        const account = await createAccount(req.body, req.user._id);
        res.status(201).json({ success: true, account });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const fetchAccounts = async (req, res) => {
    try {
        const accounts = await getAccounts(req.query);
        res.status(200).json({ success: true, accounts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- Ledgers ---
export const addLedger = async (req, res) => {
    try {
        const ledger = await createLedger(req.body, req.user._id);
        res.status(201).json({ success: true, ledger });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const fetchLedgers = async (req, res) => {
    try {
        const ledgers = await getLedgers(req.query);
        res.status(200).json({ success: true, ledgers });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- Vouchers ---
export const addVoucher = async (req, res) => {
    try {
        const voucher = await createVoucher(req.body, req.user._id);
        res.status(201).json({ success: true, voucher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const fetchVouchers = async (req, res) => {
    try {
        const vouchers = await getVouchers(req.query);
        res.status(200).json({ success: true, vouchers });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const cancelVoucherRecord = async (req, res) => {
    try {
        const voucher = await cancelVoucher(req.params.id, req.user._id);
        res.status(200).json({ success: true, voucher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- Programs ---
export const fetchPrograms = async (req, res) => {
    try {
        const programs = await getPrograms(req.query);
        res.status(200).json({ success: true, programs });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const syncProjectToProgram = async (req, res) => {
    try {
        const { projectId, clientId } = req.body;
        const program = await resolveProgramForProject(projectId, clientId, req.user._id);
        res.status(200).json({ success: true, program });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const clearProgramForProcurement = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const program = await clearForProcurement(id, notes);
        res.status(200).json({ success: true, program });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- Stats ---
export const fetchStats = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

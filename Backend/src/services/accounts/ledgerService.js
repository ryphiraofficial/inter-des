import Ledger from '../../models/accounts/Ledger.js';
import Voucher from '../../models/accounts/Voucher.js';

export const createLedger = async (data, userId) => {
    return await Ledger.create({
        ...data,
        createdBy: userId
    });
};

export const getLedgers = async (filters = {}) => {
    return await Ledger.find(filters)
        .populate('linkedClient', 'name email phone')
        .populate('linkedVendor', 'name email phone')
        .sort({ name: 1 });
};

export const resolveLedgerForClient = async (clientId, clientName, userId) => {
    let ledger = await Ledger.findOne({ linkedClient: clientId });
    if (!ledger) {
        ledger = await createLedger({
            name: `${clientName} (Client)`,
            type: 'Customer',
            linkedClient: clientId
        }, userId);
    }
    return ledger;
};

export const resolveLedgerForVendor = async (vendorId, vendorName, userId) => {
    let ledger = await Ledger.findOne({ linkedVendor: vendorId });
    if (!ledger) {
        ledger = await createLedger({
            name: `${vendorName} (Vendor)`,
            type: 'Vendor',
            linkedVendor: vendorId
        }, userId);
    }
    return ledger;
};

export const recalculateLedgerBalance = async (ledgerId) => {
    const ledger = await Ledger.findById(ledgerId);
    if (!ledger) return 0;

    const vouchers = await Voucher.find({ ledger: ledgerId, status: 'Posted' });
    let balance = ledger.openingBalance || 0;

    // Logic:
    // If Customer: Sale increases balance due (+Dr). Receipt decreases balance due (-Cr).
    // If Vendor: Purchase increases balance due (+Cr). Payment decreases balance due (-Dr).
    for (const vch of vouchers) {
        if (ledger.type === 'Customer') {
            if (vch.type === 'Sale') balance += vch.amount;
            if (vch.type === 'Receipt') balance -= vch.amount;
            if (vch.type === 'Journal') balance += vch.amount;
        } else if (ledger.type === 'Vendor') {
            if (vch.type === 'Purchase') balance += vch.amount;
            if (vch.type === 'Payment') balance -= vch.amount;
            if (vch.type === 'Journal') balance += vch.amount;
        }
    }

    ledger.balanceDue = balance;
    await ledger.save();
    return balance;
};

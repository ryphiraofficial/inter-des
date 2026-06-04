import Staff from '../../models/admin/Staff.js';

export const getStaffSalary = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id).select('name staffId role salary');
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateStaffSalary = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    salary: {
                        baseSalary: Number(req.body.baseSalary) || 0,
                        hra: Number(req.body.hra) || 0,
                        travelAllowance: Number(req.body.travelAllowance) || 0,
                        otherAllowances: Number(req.body.otherAllowances) || 0,
                        providentFund: Number(req.body.providentFund) || 0,
                        taxDeduction: Number(req.body.taxDeduction) || 0,
                        otherDeductions: Number(req.body.otherDeductions) || 0,
                        effectiveFrom: req.body.effectiveFrom || null,
                        notes: req.body.notes || ''
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

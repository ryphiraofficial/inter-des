import Staff from '../../models/admin/Staff.js';

export const getAllStaff = async (req, res, next) => {
    try {
        const staff = await Staff.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getStaffById = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff not found'
            });
        }
        res.status(200).json({
            success: true,
            data: staff
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

import User from '../../models/admin/User.js';
import Staff from '../../models/admin/Staff.js';

export const createStaff = async (req, res, next) => {
    try {
        const { name, email, phone, role, joiningDate, status, password, dob } = req.body;

        if (!name || name.trim().length < 2) return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
        if (!phone || !/^[0-9]{10}$/.test(phone)) return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits' });
        if (!role || role.trim().length < 2) return res.status(400).json({ success: false, message: 'Role is required (at least 2 characters)' });
        if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email address' });

        if (email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) return res.status(400).json({ success: false, message: 'A user with this email already exists' });
        }

        const staff = await Staff.create({ name, email, phone, role, joiningDate, status, dob, createdBy: req.user.id });

        if (email && password) {
            let dept = 'Admin';
            if (role.toLowerCase().includes('design')) dept = 'Design';
            else if (role.toLowerCase().includes('procurement')) dept = 'Procurement';
            else if (role.toLowerCase().includes('production')) dept = 'Production';
            else if (role.toLowerCase().includes('accounts')) dept = 'Accounts';

            await User.create({
                fullName: name, email, phone, role: role, password, department: dept,
                staffId: staff.staffId, status: 'Active', dob
            });
        }

        res.status(201).json({ success: true, data: staff });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ success: false, message: `A staff member with this ${field} already exists` });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateStaff = async (req, res, next) => {
    try {
        let staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

        staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        let user = null;
        if (staff.staffId) user = await User.findOne({ staffId: staff.staffId });
        if (!user && staff.email) user = await User.findOne({ email: staff.email.toLowerCase() });

        if (user) {
            user.fullName = staff.name;
            user.email = staff.email;
            user.phone = staff.phone;
            user.role = staff.role;
            user.status = staff.status === 'Inactive' ? 'Inactive' : 'Active';
            user.dob = staff.dob;
            if (req.body.password) user.password = req.body.password;
            await user.save();
        }

        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ success: false, message: 'Update failed: Email or Phone already in use' });
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });

        if (staff.staffId) await User.findOneAndDelete({ staffId: staff.staffId });
        await Staff.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

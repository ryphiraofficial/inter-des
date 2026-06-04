import TeamMember from '../../models/admin/TeamMember.js';

export const getMembers = async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createMember = async (req, res) => {
    try {
        const member = await TeamMember.create(req.body);
        res.status(201).json({ success: true, data: member });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

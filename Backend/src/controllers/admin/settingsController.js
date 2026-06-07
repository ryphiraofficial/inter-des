import Settings from '../../models/admin/Settings.js';

/**
 * @desc    Get public application settings (logo, name)
 * @route   GET /api/settings/public
 * @access  Public
 */
export const getPublicSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.status(200).json({
            success: true,
            data: {
                company: settings?.company || {}
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get application settings
 * @route   GET /api/settings
 * @access  Private (Admin)
 */
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update application settings
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
export const updateSettings = async (req, res) => {
    try {
        const updateData = {};

        // Only update the sections that are provided
        if (req.body.company) updateData.company = req.body.company;
        if (req.body.documents) updateData.documents = req.body.documents;
        if (req.body.notifications) updateData.notifications = req.body.notifications;
        if (req.body.security) updateData.security = req.body.security;
        if (req.body.application) updateData.application = req.body.application;

        const settings = await Settings.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: settings,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

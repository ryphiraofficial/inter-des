import User from '../../models/admin/User.js';
import { sendTokenResponse } from './authLoginController.js';

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            phone,
            password,
            role: role || 'User'
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

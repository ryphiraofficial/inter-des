import jwt from 'jsonwebtoken';
import Client from '../../models/sales/Client.js';

// In-memory store for OTPs (for development/simulation purposes)
// In a real production app, this would be Redis or a field in the DB with an expiration TTL.
global.CLIENT_OTP_STORE = global.CLIENT_OTP_STORE || new Map();

/**
 * @desc    Request OTP for Client Login
 * @route   POST /api/client-auth/request-otp
 * @access  Public
 */
export const requestOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a registered mobile number'
            });
        }

        // Clean up phone string (e.g. remove spaces/hyphens)
        const cleanPhone = phone.replace(/[^0-9+]/g, '');

        // Find client by phone
        // We might want to handle partial matches or ensure exactly formatted numbers.
        // For now, exact match.
        const client = await Client.findOne({ phone: cleanPhone });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'No active project found with this mobile number. Please contact your account manager.'
            });
        }

        // Generate a random 6-digit OTP (or a hardcoded one for pure testing)
        // For development simulation, we will use a static OTP '123456' OR generate one.
        // Let's generate one, but also accept 123456 as a master fallback for easy testing if desired.
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the OTP with the phone as key
        global.CLIENT_OTP_STORE.set(cleanPhone, {
            otp: generatedOtp,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
        });

        // SIMULATED OTP DELIVERY
        console.log(`\n========================================`);
        console.log(`[SIMULATED SMS] To: ${cleanPhone}`);
        console.log(`Your WoodAura Client Portal OTP is: ${generatedOtp}`);
        console.log(`(Note: '123456' will also work for testing)`);
        console.log(`========================================\n`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your mobile number'
        });

    } catch (error) {
        console.error('Request OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while requesting OTP'
        });
    }
};

/**
 * @desc    Verify OTP and Login Client
 * @route   POST /api/client-auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both mobile number and OTP'
            });
        }

        const cleanPhone = phone.replace(/[^0-9+]/g, '');
        
        // 1. Check if client exists
        const client = await Client.findOne({ phone: cleanPhone });
        
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // 2. Validate OTP
        const storedOtpData = global.CLIENT_OTP_STORE.get(cleanPhone);
        
        let isValid = false;

        // Allow '123456' as universal test OTP
        if (otp === '123456') {
            isValid = true;
        } else if (storedOtpData && storedOtpData.otp === otp) {
            // Check expiry
            if (Date.now() > storedOtpData.expiresAt) {
                global.CLIENT_OTP_STORE.delete(cleanPhone);
                return res.status(400).json({
                    success: false,
                    message: 'OTP has expired. Please request a new one.'
                });
            }
            isValid = true;
        }

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP. Please try again.'
            });
        }

        // Clear OTP after successful login
        global.CLIENT_OTP_STORE.delete(cleanPhone);

        // 3. Generate JWT Token
        // Role is set strictly to 'Client' to differentiate from internal users
        const payload = {
            id: client._id,
            role: 'Client',
            name: client.name
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRE || '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            data: {
                _id: client._id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                projectName: client.projectName,
                role: 'Client'
            }
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while verifying OTP'
        });
    }
};

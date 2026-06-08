import jwt from 'jsonwebtoken';
import Client from '../models/sales/Client.js';

/**
 * Protect routes - Verify JWT token for Client
 */
export const protectClient = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // Get client from token
            if (decoded.role !== 'Client') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized as a Client.'
                });
            }

            req.user = await Client.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Client account not found'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in client authentication'
        });
    }
};
